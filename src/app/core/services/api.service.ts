import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CountryInfo, Course, Faculty, University } from '../interfaces/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = environment.baseUrl;
  constructor(private _HttpClient: HttpClient ) { }
   getCurrency(){
    const apiURl = "https://openexchangerates.org/api/currencies.json?prettyprint=false&show_alternative=false&show_inactive=false"
    return this._HttpClient.get<any>(`${apiURl}`);
  }
  /* user */
  getprofile() {
    return this._HttpClient.get(this.url + '/Auth/GetProfileInformation');
  }
  UpdateUserProfile(data:any){
    return this._HttpClient.put(this.url + '/Auth/UpdateUserProfile',data);
  }
   /* Countries */
   getAllCountries() {
    return this._HttpClient.get<CountryInfo[]>(this.url + '/Country');
  }

  /* Universities */
  getAllUniversities() {
    return this._HttpClient.get<University[]>(this.url + '/Universities');
  }
  getUniversityByCountryID(CountryID:any) {
    return this._HttpClient.get<University[]>(this.url + `/Universities/${CountryID}`);
  }

  /* Faculties */
  getAllFaculities() {
    return this._HttpClient.get<Faculty[]>(this.url + '/Faculty');
  }
  getFaculityByUnivesityID(universityID:any) {
    return this._HttpClient.get<Faculty[]>(this.url + `/Faculty/${universityID}`);
  }

 /* cources */

 /* search cource */
  // SearchCourse(credintials) {
  //   return this._HttpClient.get<Course[]>(this.url + `/Courses/Search`);
  // }
  // searchCourses(searchParams: any): Observable<Course[]> {
  //   return this._HttpClient.get<Course[]>(this.url + '/Courses/Search');
  // }
  searchCourses(searchParams: any): Observable<Course[]> {
    return this._HttpClient.post<Course[]>(`${this.url}/Courses/Search`, searchParams);
  }
  getAllCourses() {
    return this._HttpClient.get<Course[]>(this.url + '/Courses/GetAll');
  }

}
