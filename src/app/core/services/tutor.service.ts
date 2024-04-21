import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private isTutorSubject = new BehaviorSubject<boolean>(this.getInitialIsTutorValue());
  isTutor$ = this.isTutorSubject.asObservable();


  private percentSource = new BehaviorSubject<number>(0);
  percent$ = this.percentSource.asObservable();


  private userDataSubject = new BehaviorSubject<UserProfile | null>(null);
  userData$ = this.userDataSubject.asObservable();

  updateUserData(userData: UserProfile) {
    this.userDataSubject.next(userData);
  }


  constructor() { }

  private getInitialIsTutorValue(): boolean {
    const isTutorValue = localStorage.getItem('isTutor');
    return isTutorValue !== null ? true : false;
  }

  setIsTutor(value: any) {
    this.isTutorSubject.next(value);
    localStorage.setItem("isTutor", value);
  }
  updatePercent(newPercent: number) {
    this.percentSource.next(newPercent);
  }

}
