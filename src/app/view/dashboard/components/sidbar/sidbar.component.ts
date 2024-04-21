import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TutorService } from 'src/app/core/services/tutor.service';
import { UserProfile } from 'src/app/core/interfaces/user';
import { ApiService } from 'src/app/core/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sidbar',
  templateUrl: './sidbar.component.html',
  styleUrls: ['./sidbar.component.scss']
})
export class SidbarComponent {
  isTutor:boolean = false;
  myForm!: FormGroup;
  Userinfo: UserProfile = {
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
    image: null
  };
  selectedFile!: File;
  progressPercent: number = 0;
  percentComplete: number = 0;
  public  path="assets/images/default.jpg";

  constructor( private fb: FormBuilder,
               private tutorService: TutorService,
               private authService: AuthenticationService,
               private apiSer:ApiService,
               private toastrService: ToastrService)
  {
    this.tutorService.isTutor$.subscribe(isTutor => {
      this.isTutor = isTutor;
      this.initializeForm();
    });
    this.tutorService.userData$.subscribe(userData => {
      if (userData) {
        console.log("userData",userData);

        this.Userinfo = userData;
      }
    });

  }
  ngOnInit(): void {

    this.apiSer.getprofile().subscribe((res:any)=>{

      this.Userinfo = {
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
        image: (res.image && res.image !== "string") ? `data:image/png;base64,`+ res.image  : this.path
      };

    })

    this.tutorService.percent$.subscribe(percent => {
      this.progressPercent = percent;

    });
  }
  initializeForm(): void  {
    const currentFormValues = this.myForm?.value;
    this.myForm = this.fb.group({
      image: ['',  Validators.required],

    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.Userinfo.image = reader.result as string;
      // console.log("user image",this.Userinfo.image);
       console.log("user selectedFile",this.selectedFile);
      const formData = new FormData();
      formData.append('image', this.selectedFile);
    // formData.append('image', this.selectedFile, 'profile_image.jpg');


    // Append other user information to the FormData object
    formData.append('firstName', this.Userinfo.firstName);
    formData.append('lastName', this.Userinfo.lastName);
    formData.append('universityId', this.Userinfo.universityId || '');
    formData.append('countryId', this.Userinfo.countryId || '');
    formData.append('facultyId', this.Userinfo.facultyId || '');
    formData.append('phoneNumber', this.Userinfo.phoneNumber || '');
    formData.append('gender', this.Userinfo.gender || '');
    formData.append('dateOfBirth', this.Userinfo.dateOfBirth || '');
    formData.append('languages', Array.isArray(this.Userinfo.languages) ? this.Userinfo.languages.join(', ') : this.Userinfo.languages || '');
    formData.append('currency', this.Userinfo.currency || '');
    formData.append('bio', this.Userinfo.bio || '');

      this.apiSer.UpdateUserProfile(formData).subscribe(res => {
        console.log(res);
        this.toastrService.success(`image Updated Successfully`);
      this.tutorService.updateUserData(this.Userinfo);
      });
    };
    reader.readAsDataURL(this.selectedFile);
  }


  selectFileInput() {
    document.getElementById('b')?.click();
  }

  handleImageError() {
    this.Userinfo.image = this.path;
  }








}

