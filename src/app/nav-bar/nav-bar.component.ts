import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../service/loader.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(public loader: LoaderService) { }

  ngOnInit(): void {
  }

}
