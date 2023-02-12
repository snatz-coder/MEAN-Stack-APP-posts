import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Subscriber } from "rxjs";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: 'root' })

export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }


  createUser(email:string, password:string) {
    let authData: AuthData = {email: email, password:password}
    this.http.post<AuthData>("http://localhost:3000/api/user/signup", authData)
    .subscribe(response =>{
        console.log(response)
    })
  }
}