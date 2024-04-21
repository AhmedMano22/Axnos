import { Component, Input } from '@angular/core';
import { Course } from 'src/app/core/interfaces/models';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent {
  public  defaultImagePath ="assets/images/user/avatar-05.png";
  @Input() course: any;
  courses:Course[] = [];
  rate=5
  constructor( private apiSer: ApiService) {

  }

  ngOnInit() {

    // this.apiSer.getAllCourses().subscribe((res: Course[]) => {
    //   this.courses = res;
    //   console.log("courses",this.courses);

    // })
  }
}
