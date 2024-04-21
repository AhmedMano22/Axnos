import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownFilterOptions } from 'primeng/dropdown';
import * as CryptoJS from 'crypto-js';
import { ApiService } from 'src/app/core/services/api.service';
import { CountryInfo, Course, Faculty, University } from 'src/app/core/interfaces/models';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  myForm!: FormGroup;
  rate: any = 4.5;
  isReadonly = true;
  Countries: CountryInfo[] = [];
  Universites: University[] = [];
  Faculties: Faculty[] = [];
  selectedCountry: any
  selectedUniversity: any;
  selectedFaculity: any
  courses:Course[] = [];
  // courses2 = [
  //   {
  //     image: 'assets/images/courses/tutor1.png',
  //     tutor: 'Mohamed Hassan',
  //     country: 'Egypt',
  //     university: 'Mansoura University',
  //     faculity: 'Computer Science',
  //     coursesNumber: '3 courses',
  //     students: '15 Student',
  //     rate: 5,
  //     reviewers: '13',
  //     courseName: 'DataBase',
  //     coursePrice: '10$/Hour',
  //     professorName: 'Youssef Ahmed',
  //     professorLanguages: 'EN,AR',
  //   },
  //   {
  //     image: 'assets/images/courses/tutor2.png',
  //     tutor: 'Mohamed Hassan',
  //     country: 'Egypt',
  //     university: 'Mansoura University',
  //     faculity: 'Computer Science',
  //     coursesNumber: '3 courses',
  //     students: '15 Student',
  //     rate: 5,
  //     reviewers: '13',
  //     courseName: 'DataBase',
  //     coursePrice: '10$/Hour',
  //     professorName: 'Youssef Ahmed',
  //     professorLanguages: 'EN,AR',
  //   },
  //   {
  //     image: 'assets/images/courses/tutor3.png',
  //     tutor: 'Mohamed Hassan',
  //     country: 'Egypt',
  //     university: 'Mansoura University',
  //     faculity: 'Computer Science',
  //     coursesNumber: '3 courses',
  //     students: '15 Student',
  //     rate: 5,
  //     reviewers: '13',
  //     courseName: 'DataBase',
  //     coursePrice: '10$/Hour',
  //     professorName: 'Youssef Ahmed',
  //     professorLanguages: 'EN,AR',

  //   },
  //   {
  //     image: 'assets/images/courses/tutor4.png',
  //     tutor: 'Mohamed Hassan',
  //     country: 'Egypt',
  //     university: 'Mansoura University',
  //     faculity: 'Computer Science',
  //     coursesNumber: '3 courses',
  //     students: '15 Student',
  //     rate: 5,
  //     reviewers: '13',
  //     courseName: 'DataBase',
  //     coursePrice: '10$/Hour',
  //     professorName: 'Youssef Ahmed',
  //     professorLanguages: 'EN,AR',

  //   },
  //   {
  //     image: 'assets/images/courses/tutor5.png',
  //     tutor: 'Mohamed Hassan',
  //     country: 'Egypt',
  //     university: 'Mansoura University',
  //     faculity: 'Computer Science',
  //     coursesNumber: '3 courses',
  //     students: '15 Student',
  //     rate: 5,
  //     reviewers: '13',
  //     courseName: 'DataBase',
  //     coursePrice: '10$/Hour',
  //     professorName: 'Youssef Ahmed',
  //     professorLanguages: 'EN,AR',

  //   },
  //   {
  //     image: 'assets/images/courses/tutor6.png',
  //     tutor: 'Mohamed Hassan',
  //     country: 'Egypt',
  //     university: 'Mansoura University',
  //     faculity: 'Computer Science',
  //     coursesNumber: '3 courses',
  //     students: '15 Student',
  //     rate: 5,
  //     reviewers: '13',
  //     courseName: 'DataBase',
  //     coursePrice: '10$/Hour',
  //     professorName: 'Youssef Ahmed',
  //     professorLanguages: 'EN,AR',

  //   },
  //   {
  //     image: 'assets/images/courses/tutor7.png',
  //     tutor: 'Mohamed Hassan',
  //     country: 'Egypt',
  //     university: 'Mansoura University',
  //     faculity: 'Computer Science',
  //     coursesNumber: '3 courses',
  //     students: '15 Student',
  //     rate: 5,
  //     reviewers: '13',
  //     courseName: 'DataBase',
  //     coursePrice: '10$/Hour',
  //     professorName: 'Youssef Ahmed',
  //     professorLanguages: 'EN,AR',

  //   },
  //   {
  //     image: 'assets/images/courses/tutor8.png',
  //     tutor: 'Mohamed Hassan',
  //     country: 'Egypt',
  //     university: 'Mansoura University',
  //     faculity: 'Computer Science',
  //     coursesNumber: '3 courses',
  //     students: '15 Student',
  //     rate: 5,
  //     reviewers: '13',
  //     courseName: 'DataBase',
  //     coursePrice: '10$/Hour',
  //     professorName: 'Youssef Ahmed',
  //     professorLanguages: 'EN,AR',

  //   },
  //   {
  //     image: 'assets/images/courses/tutor9.png',
  //     tutor: 'Mohamed Hassan',
  //     country: 'Egypt',
  //     university: 'Mansoura University',
  //     faculity: 'Computer Science',
  //     coursesNumber: '3 courses',
  //     students: '15 Student',
  //     rate: 5,
  //     reviewers: '13',
  //     courseName: 'DataBase',
  //     coursePrice: '10$/Hour',
  //     professorName: 'Youssef Ahmed',
  //     professorLanguages: 'EN,AR',

  //   },

  // ];


  constructor(private fb: FormBuilder, private apiSer: ApiService) {
    this.myForm = this.fb.group({
      Name: new FormControl(),
      CountryId: new FormControl(),
      UniversityId: new FormControl(),
      FaculityId: new FormControl(),
    });
  }

  ngOnInit() {
    this.apiSer.getAllCountries().subscribe((res: CountryInfo[]) => {
      this.Countries = res
    })
    this.apiSer.getAllUniversities().subscribe((res: University[]) => {
      this.Universites = res
    })
    this.apiSer.getAllFaculities().subscribe((res: Faculty[]) => {
      this.Faculties = res;
    })
    this.apiSer.getAllCourses().subscribe((res: Course[]) => {
      this.courses = res;
      console.log("courses",this.courses);

    })
  }

  // Fetch faculties based on the selected university ID
  onUniversityChange(event: any): void {
    if (this.selectedUniversity != null) {
      this.apiSer.getFaculityByUnivesityID(this.selectedUniversity).subscribe((faculties: Faculty[]) => {
      //  console.log("faculties", faculties);
        this.Faculties = faculties;
      })
    } else {
      this.Faculties = [];
    //  console.log("faculties are empty now");
    }
  }
 // Fetch Universities based on the selected Country ID
  onCountryChange(event: any): void {
    if (this.selectedCountry != null) {
      this.apiSer.getUniversityByCountryID(this.selectedCountry).subscribe((Universities:University[]) => {
        console.log("Universities", Universities);
        this.Universites = Universities;
      })
    } else {
      this.Faculties = [];
      console.log("Universities are empty now");
    }
  }

  onFormSubmit(): void {
    console.log('Form values:', this.myForm.value);
    const formValues = this.myForm.value;

    this.apiSer.searchCourses(formValues).subscribe((res: Course[])=>{
      this.courses = res
      console.log("searched cource:",res);

    })
  }


}



