import { HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { CustomHttpRespone } from '../model/custom-http-response';
import { FileUploadStatus } from '../model/file-upload-status';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  private subscriptions: Subscription[] = [];
  public users: User[];
  public refreshing: boolean;
  public selectedUser: User;
  public profileImage: File;
  private currentUsername: string;
  public editUser: User = new User();
  public deletedUser: User = new User();
  public user: User;
  public fileStatus = new FileUploadStatus();



  constructor(private router: Router, private authentificationService: AuthenticationService, private userService: UserService, private notificationService: NotificationService) { }
  ngOnDestroy(): void {
    this.subscriptions.findIndex((sub) => {
      sub.unsubscribe();
    })
  }

  ngOnInit(): void {
    this.getUsers(true);
    this.user = this.authentificationService.getUserFromLocalCache()
  }

  changeTitel(title: string) {

    this.titleSubject.next(title);

  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );

  }


  public onProfileImageChange(profileImage: File) {
    this.profileImage = profileImage
    console.log(profileImage);
  }

  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }

  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormDate(null, userForm.value, this.profileImage);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (respons: User) => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.profileImage = null;
          userForm.reset();
          this.notificationService.notify(NotificationType.SUCCESS, `${respons.firstName} ${respons.lastName} added successfully.`);
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse)
          this.notificationService.notify(NotificationType.WARNING, `${errorResponse.error.message}`);
        }
      )
    )

  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFormDate(this.currentUsername, this.editUser, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.profileImage = null;
          this.notificationService.notify(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully.`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.profileImage = null;
          this.notificationService.notify(NotificationType.WARNING, `${errorResponse.error.message}`);
        }
      )
    )
  }

  onUpdateCurrentUser(user: User) {
    this.refreshing = true;
    this.currentUsername = this.user.username;
    const formData = this.userService.createUserFormDate(this.currentUsername, user, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.authentificationService.addUserToLocalCache(response);
          this.getUsers(false);
          this.profileImage = null;
          this.refreshing = false;

          this.notificationService.notify(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully.`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.profileImage = null;
          this.notificationService.notify(NotificationType.WARNING, `${errorResponse.error.message}`);
          this.refreshing = false;

        }
      )
    )
  }

  public onUpdateProfileImage() {
    const formdata = new FormData();
    formdata.append('username', this.user.username);
    formdata.append('profileImage', this.profileImage);
    this.subscriptions.push(
      this.userService.updateProfileImage(formdata).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);

        },
        (errorResponse: HttpErrorResponse) => {
          this.fileStatus.status = 'done';
          this.notificationService.notify(NotificationType.WARNING, `${errorResponse.error.message}`);
        }
      )
    )

  }
  reportUploadProgress(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.status = 'progress';
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
        break;

      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`
          this.fileStatus.status = 'done';
          this.notificationService.notify(NotificationType.SUCCESS, `${event.body.firstName}\'s profile image updated successfully.`);
        } else {
          this.notificationService.notify(NotificationType.WARNING, `Unable to upload image, Try again.`);
        }

        break;

      default:
        'finished all progress'
        break;
    }
  }

  public updateProfileImage() {
    this.clickButton('profile-image-input');
  }



  public onLogOut() {
    this.authentificationService.logOut();
    this.router.navigate(['/login']);
    this.notificationService.notify(NotificationType.SUCCESS, 'Logged out successfully.')

  }

  public onDeleteUser() {
    this.subscriptions.push(
      this.userService.deleteUser(this.deletedUser.username).subscribe(
        (response: CustomHttpRespone) => {
          this.notificationService.notify(NotificationType.SUCCESS, `${response.message}`);
          this.getUsers(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, `${errorResponse.error.message}`);
        }
      )
    )
  }

  public onDeleteUserButton(deletedUser: User) {
    this.deletedUser = deletedUser;
    this.clickButton('confirmation')
  }

  public onResetPassword(emailForm: NgForm) {
    this.refreshing = true;

    const password = emailForm.value['password']
    const confirmPassword = emailForm.value['confirm-password']
    if (password != confirmPassword) {
      this.notificationService.notify(NotificationType.ERROR, `Mot de passe et mot de passe de confirmation ne correspondent pas`);
      this.refreshing = false;

      return
    }
    user: new User;
    this.user.password = password;
    this.user.username = this.userService.getUserFromLocalCache().username
    this.subscriptions.push(
      this.userService.resetPassword(this.user).subscribe(
        (response: CustomHttpRespone) => {
          this.notificationService.notify(NotificationType.SUCCESS, `${response.message}`);
          this.getUsers(false);
          emailForm.reset();
          this.refreshing = false;

        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, `${errorResponse.error.message}`);
          this.refreshing = false;
        }
      )
    )
  }

  public onEditUSer(editUser: User) {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    this.clickButton('openUserEdit');

  }
  public onCloseEditUser() {
    this.profileImage = null;
    this.getUsers(false);
    this.editUser = new User();
  }


  public searchUser(searchTerm: string): void {
    const result: User[] = [];
    for (const user of this.userService.getUsersFromLocalCache()) {
      if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        result.push(user);
      }
    }
    this.users = result;

    if (result.length === 0 || !searchTerm) {
      this.users = this.userService.getUsersFromLocalCache();
    }
  }


  public isAdmin(): boolean {
    return this.userService.isAdmin
  }

  private sendNotification(type: NotificationType, message: string) {
    if (message) {
      this.notificationService.notify(type, message);
    } else {
      this.notificationService.notify(type, 'An error accured. Please try again');

    }
  }

  private clickButton(buttonId: string) {
    document.getElementById(buttonId).click();
  }


}
