
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Subscriber } from "rxjs";
import { Post } from "./post.model";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})

export class PostService{
 private posts: Post[] = [];
 private postsUpdated = new Subject<Post[]>();

 constructor(private http:HttpClient, private router:Router){}

 getPosts(){
   this.http.get<{message:string, posts: any}>('http://localhost:3000/api/posts/')
   .pipe(map((postData) => {
      return postData.posts.map((post: { title: any; content: any; _id: any; }) => {
        return {
          title:post.title,
          content:post.content,
          id:post._id
        }
      })
   }))
   .subscribe(transformedPost => {
       this.posts = transformedPost;
       this.postsUpdated.next([...this.posts]);
   });
 }

 getPost(id: string){
   console.log("get post",id)
  // return {...this.posts.find(p => p.id === id)}
    return this.http.get<{_id:string, title:string, content:string }>('http://localhost:3000/api/posts/' + id)
 }

 getPostUpdateListener(){
   return this.postsUpdated.asObservable();
 }

 addPost(id:string, title: string, content:string){
   const post: Post = {
     id:id,title: title, content: content
   };
   console.log("test post id",id)
   this.http.post<{message:string, postId:string}>('http://localhost:3000/api/posts', post)
   .subscribe((responseData)=> {
     console.log(responseData.message);
     const postId = responseData.postId   //fetched from server
     post.id = postId;
     this.posts.push(post);
     this.postsUpdated.next([...this.posts]);
     this.router.navigate(["/"])
   });

 }

 updatePost(id:string, title:string, content:string){
  const post: Post = {id: id, title:title, content:content};
   this.http.put<{message:string, postId:string}>('http://localhost:3000/api/posts/' + id, post)
   .subscribe(response => {
     const updatedPosts = [...this.posts];
     const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
     updatedPosts[oldPostIndex] = post;
     this.posts = updatedPosts;
     this.postsUpdated.next([...this.posts]);
     this.router.navigate(["/"])
   })
}

 deletePost(postId:string){
  this.http.delete<{message:string}>('http://localhost:3000/api/posts/' + postId)
  .subscribe(() => {
   const updatedPosts = this.posts.filter(post => post.id !== postId);
   this.posts = updatedPosts;
   this.postsUpdated.next([...this.posts])
 }
 )
}


}