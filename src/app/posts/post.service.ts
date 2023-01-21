
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Subscriber } from "rxjs";
import { Post } from "./post.model";


@Injectable({providedIn: 'root'})

export class PostService{
 private posts: Post[] = [];
 private postsUpdated = new Subject<Post[]>();

 constructor(private http:HttpClient){}

 getPosts(){
   this.http.get<{message:string, posts: Post[]}>('http://localhost:3000/api/posts/')
   .subscribe((postData) => {
       this.posts = postData.posts;
       this.postsUpdated.next([...this.posts]);
   });
 }

 getPostUpdateListener(){
   return this.postsUpdated.asObservable();
 }

 addPost(id:string, title: string, content:string){
   const post: Post = {
     id:id,title: title, content: content
   };
   this.http.post<{message:string}>('http://localhost:3000/api/posts', post)
   .subscribe((responseData)=> {
     console.log(responseData.message);
     this.posts.push(post);
     this.postsUpdated.next([...this.posts])
   });

 }
}