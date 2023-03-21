import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Subscriber } from "rxjs";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: 'root' })

export class AuthService {
  private isAuthenticated = false;
  private token!: any;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId!: string | any;
  constructor(private http: HttpClient, private router: Router) { }

   getToken(){
    return this.token;
   }

   getUserId(){
    return this.userId;
   }

   getIsAuth(){
     return this.isAuthenticated;
   }

   getAuthStatusListener(){
    return this.authStatusListener.asObservable();
   }

  createUser(email:string, password:string) {
    let authData: AuthData = {email: email, password:password}
    this.http.post<AuthData>("http://localhost:3000/api/user/signup", authData)
    .subscribe(response =>{
        this.router.navigate(["/"])
    }, error => {
      this.authStatusListener.next(false)
    })
  }

  login(email:string, password:string){
    let authData: AuthData = {email: email, password:password}
    this.http.post<{token:string, expiresIn:number, userId:string}>("http://localhost:3000/api/user/login", authData)
    .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token){
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId)
          this.router.navigate(['/'])
        }
    }, error => {
      this.authStatusListener.next(false)
    })
  }


  autoAuthUser(){
   const authInformation = this.getAuthData();
   if (!authInformation){
     return;
   }
   const now = new Date();
   const expiresIn =  authInformation!.expirationDate.getTime() - now.getTime();
   if(expiresIn > 0){
     this.token = authInformation?.token;
     this.isAuthenticated = true;
     this.setAuthTimer(expiresIn / 1000);
     this.authStatusListener.next(true);
   }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.router.navigate(['/']);
    this.clearAuthData()
    clearTimeout(this.tokenTimer)
  }


  private setAuthTimer(duration:number){
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }

  private saveAuthData(token:string, expirationDate: Date, userId:string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration") || '';
    const userId = localStorage.getItem("userId") || '';
    if(!token && !expirationDate){
      return;
    }
    return { 
      token: token,
      expirationDate:new Date(expirationDate),
      userId: userId
    }
  }
}