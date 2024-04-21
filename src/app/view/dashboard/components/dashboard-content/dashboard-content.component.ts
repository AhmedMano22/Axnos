import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { TutorService } from 'src/app/core/services/tutor.service';
import { SearchCountryField } from 'ngx-intl-tel-input';
import { CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { UserProfile } from 'src/app/core/interfaces/user';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import {
  CountryInfo,
  Faculty,
  University,
} from 'src/app/core/interfaces/models';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import parsePhoneNumberFromString from 'libphonenumber-js';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss'],
})
export class DashboardContentComponent implements OnInit {
  private intervalSubscription: Subscription | undefined;
  @Output() percentChange = new EventEmitter<number>();

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  phoneActive: string = '';
  separateDialCode = true;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  isTutor: boolean = false;
  isSubmited = false;
  currency: any = {};
  currencyEntries: any[] = [];
  cities = ['assuit', 'cairo'];
  states = ['Bozorgi', 'Bozo'];
  gender = ['Male', 'Fmale'];
  languages: string[] = ['English', 'Spanish', 'French', 'German'];
  myForm!: FormGroup;
  percent: number = 0;

  Countries: CountryInfo[] = [];
  Universites: University[] = [];
  Faculties: Faculty[] = [];
  selectedCountry: any;
  selectedUniversity: any;
  selectedFaculity: any;
  sweetAlertShown = false;
  formValidated = false;
  hasReached100Before: boolean = false;
  isLoading: boolean = true;

  User: UserProfile = {
    firstName: '',
    lastName: '',
    universityId: null,
    countryId: null,
    facultyId: null,
    phoneNumber: null,
    gender: null,
    dateOfBirth: null,
    languages: null,
    currency: null,
    bio: null,
    image: null,
  };
  public path = 'assets/images/user/avatar-05.png';
  constructor(
    private tutorService: TutorService,
    private apiSer: ApiService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private toastrService: ToastrService
  ) {
    this.tutorService.isTutor$.subscribe((isTutor) => {
      this.isTutor = isTutor;
      this.initializeForm();
    });
  }
  ngOnInit(): void {

    this.apiSer.getCurrency().subscribe((res: any) => {
      this.currency = res;
      this.currencyEntries = Object.entries(res);
    });
    this.apiSer.getAllCountries().subscribe((res: CountryInfo[]) => {
      this.Countries = res;
    });
    this.apiSer.getAllUniversities().subscribe((res: University[]) => {
      this.Universites = res;
    });
    this.apiSer.getAllFaculities().subscribe((res: Faculty[]) => {
      this.Faculties = res;
      this.selectedFaculity = '';
    });
    this.isLoading = true;
    this.apiSer.getprofile().subscribe((res: any) => {
      this.User = {
        firstName: res.firstName || res.given_name,
        lastName: res.lastName || res.family_name,
        universityId: res.universityId || null,
        countryId: res.countryId || null,
        facultyId: res.facultyId || null,
        phoneNumber: res.phoneNumber || null,
        gender: res.gender || null,
        dateOfBirth: res.dateOfBirth || null,
        languages: res.languages || null,
        currency: res.currency || null,
        bio: res.bio || null,
        image:res.image && res.image !== 'string'
            ? `data:image/png;base64,` + res.image
            : this.path,
      };
      this.isLoading = false;
      console.log('user is:', this.User);
      this.selectedUniversity = this.User.universityId;
      this.selectedCountry = this.User.countryId;

    });
    this.tutorService.userData$.subscribe(userData => {
      if (userData) {
        this.User = userData;
      }
    });
  }
  initializeForm(): void {
    const currentFormValues = this.myForm?.value;
    this.myForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      universityId: ['', Validators.required],
      countryId: ['', Validators.required],
      facultyId: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      gender: ['', this.isTutor ? Validators.required : null],
      dateOfBirth: ['', this.isTutor ? Validators.required : ''],
      languages: ['', this.isTutor ? Validators.required : null],
      currency: ['', this.isTutor ? Validators.required : null],
      bio: [ '',this.isTutor ? [Validators.required, Validators.minLength(10)] : '',],
    });

    if (currentFormValues) {
      this.myForm.patchValue(currentFormValues);
    }
    Object.values(this.myForm.controls).forEach((control) => {
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

  onUniversityChange(event: any): void {
    if (this.selectedUniversity != null) {
      this.apiSer
        .getFaculityByUnivesityID(this.selectedUniversity)
        .subscribe((faculties: Faculty[]) => {
          this.Faculties = faculties;
        });
    } else {
      this.Faculties = [];
    }
  }

  onCountryChange(event: any): void {
    if (this.selectedCountry != null) {
      this.apiSer
        .getUniversityByCountryID(this.selectedCountry)
        .subscribe((Universities: University[]) => {
          this.Universites = Universities;
        });
    } else {
      this.Faculties = [];
    }
  }

  submitForm() {
    this.isSubmited = true;
    if (this.myForm.value.phoneNumber) {
      this.myForm.value.phoneNumber = this.myForm.value.phoneNumber.e164Number;
    }
    console.log(this.myForm.value);
    if (this.myForm.valid) {
      this.apiSer.getprofile().subscribe((userInfo: any) => {
        const image = this.User.image;
        const formData = new FormData();

        // Append form values
        for (const key in this.myForm.value) {
          if (this.myForm.value.hasOwnProperty(key)) {
            formData.append(key, this.myForm.value[key]);
          }
        }
        // Convert base64 image to file
        if (typeof image === 'string') {
          fetch(image)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], 'profile_image.jpg', {
                type: 'image/jpeg',
              });
              formData.append('image', file);
              this.updateUserProfile(formData);
            });
        } else {
          // Image is already a file
          if (image) {
            formData.append('image', image);
          }
          this.updateUserProfile(formData);
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }

  updateUserProfile(formData: FormData) {

    this.apiSer.UpdateUserProfile(formData).subscribe({
      next: (res: any) => {
        //debugger
        console.log(res);
        this.toastrService.success(`Profile Updated Successfully`);
        this.tutorService.updateUserData(this.User);
      },
      error: (errors) => {
        let errorMessage = '';
        let erorrObj = errors.error.errors;

        for (const key in erorrObj) {
          if (erorrObj.hasOwnProperty(key)) {
            const errorMessages = erorrObj[key];
            errorMessage += `<strong>${key}:</strong> ${errorMessages.join(
              ', '
            )}<br>`;
          }
        }
        Swal.fire({
          icon: 'error',
          title: 'Error occurred',
          html: errorMessage,
        });

        console.error(
          'Error occurred while submitting signup form:',
          errors.error.errors
        );
      },
    });
  }

  calculatePercent(): void {
    let validControlsCount = 0;
    let totalControls = 0;
    const controls = this.myForm.controls;
    const tutorOnlyControls = [
      'gender',
      'dateOfBirth',
      'languages',
      'currency',
      'bio',
    ];
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
    const previousPercent = this.percent;
    this.percent =
      totalControls > 0
        ? Math.floor((validControlsCount / totalControls) * 100)
        : 0;
    this.percentChange.emit(this.percent);
    this.tutorService.updatePercent(this.percent);

    if (this.percent === 100 && previousPercent < 100) {
      this.hasReached100Before = true;
    }
    if (this.percent === 100 && this.hasReached100Before) {
      // Swal.fire({
      //   title: 'Congratulations  \ud83c\udf89',
      //   html: "<div style='text-align: center;'>Your profile is now complete! <span style='font-size: 24px;'>&#128175;</span></div>",
      //   icon: 'success',
      // });
      this.hasReached100Before = false;
    }
  }








}
