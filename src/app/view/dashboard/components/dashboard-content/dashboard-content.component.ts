import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { TutorService } from 'src/app/core/services/tutor.service';
import { SearchCountryField } from 'ngx-intl-tel-input';
import { CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { UserProfile } from 'src/app/core/interfaces/user';
@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent {
  @Output() percentChange = new EventEmitter<number>();
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  phoneActive:string = '';
  separateDialCode = true;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  isTutor:boolean = false;
  isSubmited = false;
  currency:any ={};
  currencyEntries: any[] = [];
  universites=['Mansoura','assuit'];
  countries=['Egypt','Palastin'];
  faculities=['Computer Scince','medicin'];
  cities=['assuit','cairo'];
  states=['Bozorgi','Bozo'];
  gender=['Male','Fmale'];
  languages: string[] = ['English', 'Spanish', 'French', 'German'];
  myForm!: FormGroup;
  percent: number = 0;
  User: UserProfile = {
    firstName: '',
    lastName: '',
    email: '',
    universityId: null,
    countryId: null,
    facultyId: null,
    phoneNumber: null,
    gender: null,
    dateOfBirth: null,
    languages: null,
    currency: null,
    bio: null,
    image: null
  };
  public  path="assets/images/user/avatar-05.png";
  constructor( private tutorService: TutorService,
               private apiSer:ApiService,
               private fb: FormBuilder,
               private authService: AuthenticationService
               )
  {
    this.tutorService.isTutor$.subscribe(isTutor => {
      this.isTutor = isTutor;
      this.initializeForm();
      this.calculatePercent();
    });
  }
  ngOnInit(): void {
    this.apiSer.getCurrency().subscribe((res:any)=>{
      this.currency = res
      this.currencyEntries = Object.entries(res);
    })
    // this.authService.user$.subscribe(user => {
    //   // this.User = { ...user };
    //   this.User = {
    //     firstName: user.firstName || user.given_name,
    //     lastName: user.lastName || user.family_name,
    //     ...user
    //   };
    // });
    this.apiSer.getprofile().subscribe((res:any)=>{

      this.User = {
        firstName: res.firstName || res.given_name,
        lastName: res.lastName || res.family_name,
        email: res.email || '',
        universityId: res.universityId || null,
        countryId: res.countryId || null,
        facultyId: res.facultyId || null,
        phoneNumber: res.phoneNumber || null,
        gender: res.gender || null,
        dateOfBirth: res.dateOfBirth || null,
        languages: res.languages || null,
        currency: res.currency || null,
        bio: res.bio || null,
        image: res.image || this.path
      };

    })
  }
  initializeForm(): void  {
    const currentFormValues = this.myForm?.value;
    this.myForm = this.fb.group({
      firstName: ['',  Validators.required],
      lastName: ['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      university: ['', this.isTutor ? Validators.required : null],
      country: ['', this.isTutor ? Validators.required : null],
      faculty: ['', this.isTutor ? Validators.required : null],
      phoneNumber: ['', this.isTutor ? Validators.required : ''],
      gender: [ '', this.isTutor ? Validators.required :null],
      dateOfBirth: ['', this.isTutor ? Validators.required : ''],
      languages: ['', this.isTutor ? Validators.required : null],
      currency: ['', this.isTutor ? Validators.required : null],
      bio: ['', this.isTutor ? [Validators.required, Validators.minLength(10)] : '']

    });

    if (currentFormValues) {
      this.myForm.patchValue(currentFormValues);
    }
    Object.values(this.myForm.controls).forEach(control => {
      control.valueChanges.subscribe((res) => {

        if (control.valid) {
          this.calculatePercent();
        }
      });
    });
    this.myForm.valueChanges.subscribe(() => {
      this.calculatePercent();
    });
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  submitForm() {
    this.isSubmited = true

  }

  calculatePercent(): void {
    let validControlsCount = 0;
    let totalControls = 0;
    const controls = this.myForm.controls;
    const tutorOnlyControls = ['gender', 'dateOfBirth', 'languages', 'currency', 'bio'];
    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        // Check if the current control is for tutors only and if isTutor is false, skip this iteration.
        if (tutorOnlyControls.includes(controlName) && !this.isTutor) {
          continue; // Skip this control as it is tutor only and isTutor is false.
        }
        const control = controls[controlName];
        if (control.valid && control.value != null && control.value !== '') {
          validControlsCount++;
        }
        totalControls++; // Increment totalControls here to include only relevant controls.
      }
    }
    this.percent = totalControls > 0 ? Math.floor((validControlsCount / totalControls) * 100) : 0;
    this.percentChange.emit(this.percent);
    this.tutorService.updatePercent(this.percent);

    if (this.percent === 100) {
      Swal.fire({
        title: "congratulations  \ud83c\udf89",
        html: "<div style='text-align: center;'>Your profile is now complete! <span style='font-size: 24px;'>&#128175;</span></div>",
        icon: "success"
      });
    }
  }

}

