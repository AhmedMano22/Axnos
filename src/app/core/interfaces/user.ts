
export interface User {
    jti:number ;
    userId:number ;
    sub:string;
    genderId:number ;
    academicYearId:number ;
    boysAcademicYearID:number ;
    girlsAcademicYearID :number ;
    userType:number ;
    departmentId:number ;
    divisionId:number ;
    sectionId:number ;
    position:string ;
    isSuper:boolean ;
    pageSize:number ;
    JobId:number ;
    isManager:boolean ;
    Jobs:[] ;
    exp:string ;
 }

export interface SignupCredentials {
    emailAddress: string;
    firstName: string;
    lastName: string;
    password: string;
  }
  export interface LoginCredentials {
    emailAddress: string;
    password: string;
  }
export interface UserProfile {
  firstName: string;
  lastName: string;
  universityId: string | null;
  countryId: string | null;
  facultyId: string | null;
  phoneNumber: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  languages: string[] | null;
  currency: string | null;
  bio: string | null;
  image: string | null;
}
