import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Subscriber } from "rxjs";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: 'root' })

export class AuthService {
  private token!: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) { }

   getToken(){
    return this.token;
   }

   getAuthStatusListener(){
    return this.authStatusListener.asObservable();
   }

  createUser(email:string, password:string) {
    let authData: AuthData = {email: email, password:password}
    this.http.post<AuthData>("http://localhost:3000/api/user/signup", authData)
    .subscribe(response =>{
        console.log(response)
    })
  }

  login(email:string, password:string){
    let authData: AuthData = {email: email, password:password}
    this.http.post<{token:string}>("http://localhost:3000/api/user/login", authData)
    .subscribe(response => {
        const token = response.token;
        this.token = token;
        this.authStatusListener.next(true)
    })
  }
}