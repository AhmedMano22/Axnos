import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TutorService } from 'src/app/core/services/tutor.service';

@Component({
  selector: 'app-sidbar',
  templateUrl: './sidbar.component.html',
  styleUrls: ['./sidbar.component.scss']
})
export class SidbarComponent {
  isTutor:boolean = false;
  User: any;
  constructor(private tutorService: TutorService,private authService: AuthenticationService){
    this.tutorService.isTutor$.subscribe(isTutor => {
      this.isTutor = isTutor;
    });
  }
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.User = user;
    });
  }

}
