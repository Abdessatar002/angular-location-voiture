import { Component, ElementRef, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'locationapp';
  @ViewChild('content', { static: false }) el !: ElementRef

  generatePdf() {
    let pdf = new jsPDF('p', 'pt', 'a4', true)

    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        pdf.output("dataurlnewwindow")
      }
    })
  }
}
