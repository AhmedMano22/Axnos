import { Component } from '@angular/core';
import { TutorService } from 'src/app/core/services/tutor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  percentComplete: number = 0;
  isTutor:boolean = false;

  constructor(private tutorService: TutorService){
    this.tutorService.isTutor$.subscribe(isTutor => {
      this.isTutor = isTutor;
    });
  }
  ngOnInit() {

    this.tutorService.percent$.subscribe(percent => {
      this.percentComplete = percent;
    });
  }
  firesweetAlert(){
      Swal.fire({
        html: "<div class='parentSweet'> <span class='title'>Would you like to be a tutor?</span> <br/>  <span class='subtitle'>Please complete your Profile first</span></div> ",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        cancelButtonText:"No, return to student Profile",
        confirmButtonText: "Yes, confirm",
        customClass: {
          confirmButton: 'confirm-button-class',
          cancelButton: 'cancel-button-class'
        }
        }).then((result) => {
        if (result.isConfirmed) {
          this.isTutor = true;
          this.tutorService.setIsTutor(this.isTutor);
        } else {
          console.log("Cancel action triggered");
        }
        });
}









}
