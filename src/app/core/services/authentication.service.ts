import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SignupCredentials, User } from '../interfaces/user';
import Swal from 'sweetalert2'
import { GenericService } from './generic.service';
import jwt_decode from 'jwt-decode';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
   userSubject :BehaviorSubject<any> = new BehaviorSubject<any>(null);
   public user$ = this.userSubject.asObservable();
   userToken = new BehaviorSubject(null);
    public token:any
    public userID = localStorage.getItem("userId")
    payload = JSON.parse(localStorage.getItem('payload') || '{}');
    constructor(private http: HttpClient , private router:Router , private route: ActivatedRoute, private tostar:ToastrService,  private generalSer:GenericService ) {

      if (localStorage.getItem('userId') != null && localStorage.getItem('authMethod') !== 'google') {
        this.getUserById(this.userID).subscribe(user => {
          if (user) {
            this.userSubject.next(user);
          }
        });
        this.savecurrentuserID();
      }else if(localStorage.getItem('userId') != null && localStorage.getItem('authMethod') === 'google'){
        this.userSubject.next(this.payload);
        this.savecurrentuserID();
      }

    }
    savecurrentuserID() {
      let id: any = localStorage.getItem('userId');
      this.userToken.next(id);
    }

    login(email: string, password: string): void {
      let id = localStorage.getItem("userId")
     if(!id)
      this.http.get<any>(`${environment.apiUrl}/SignupUsers`).subscribe({

        next: (res) => {

          const user = res.find((a: any) => {
            return a.email === email && a.password === password;
          });
          if (user) {

            Swal.fire({
              title: "Good job!",
              text: "You logged in successfully",
              icon: "success"
            }).then(() => {
              let uID = user.id;
              this.userSubject.next(user);
              this.userToken.next(uID);
              localStorage.setItem("userId", uID);
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
              this.router.navigateByUrl(returnUrl);
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Sorry...",
              text: "Please make sure the data is correct",

            });
          }
        },
        error: (error) => {

          console.error('Error occurred while submitting form:', error);
        }
      });
    }
    signup(credentials: SignupCredentials): void {
      this.http.post<any>(`${environment.apiUrl}/SignupUsers`, credentials).subscribe({
        next: (res) => {
          Swal.fire({
            title: "Success!",
            text: "You have successfully signed up",
            icon: "success"
          }).then(() => {
            this.router.navigate(['/auth/Login']);
          });
        },
        error: (error) => {
          console.error('Error occurred while submitting signup form:', error);
        }
      });
    }
    getDecodedAccessToken(token: string): any {
      try {
        return jwt_decode(token);
      } catch (Error) {
        return null;
      }
    }
    loginWithGoogle(response: any): void {
      if (response) {
        const payload2 = this.getDecodedAccessToken(response.credential);
        localStorage.setItem("payload", JSON.stringify(payload2));
        const token = response.credential;
        //localStorage.setItem('userToken', token);
        localStorage.setItem("userId", token);
        localStorage.setItem('authMethod', 'google');
        this.userToken.next(token);
        this.userSubject.next(payload2);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      }
    }
    logout(): void {
      window.location.reload()
      localStorage.removeItem('userId');
      localStorage.removeItem('isTutor');
      localStorage.removeItem('payload');
      localStorage.removeItem('authMethod');
      localStorage.setItem('isLoginActive', JSON.stringify(true));
      localStorage.setItem('isSignupActive', JSON.stringify(false));
      this.userToken.next(null);

    }
  private getUserById(userId: any): Observable<any> {
      return this.http.get<User>(`${environment.apiUrl}/SignupUsers/${userId}`);
    }


}















// const currentUrl = this.router.url;
      // if (currentUrl.startsWith('/courses') || currentUrl.startsWith('/tutors')  ) {
      //   this.router.navigate(['/auth/Login']);
      // }
