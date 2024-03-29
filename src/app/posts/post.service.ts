
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Subscriber } from "rxjs";
import { Post } from "./post.model";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: 'root' })

export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage:number, currentPage:number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts:number }>(BACKEND_URL + queryParams)
      .pipe(map((postData) => {
        return { 
          post: postData.posts.map((post: { title: any; content: any; _id: any; imagePath: any; creator:any }) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator:post.creator
          }
        }), 
        maxPosts: postData.maxPosts}

      }))
      .subscribe(transformedPostData => {
        console.log("transformed",transformedPostData)
        this.posts = transformedPostData.post;
        this.postsUpdated.next({ 
          posts:[...this.posts], 
          postCount:transformedPostData.maxPosts
        });
      });
  }

  getPost(id: string) {
    // return {...this.posts.find(p => p.id === id)}
    return this.http.get<{ _id: string, title: string, content: string, imagePath:string, creator:string }>(BACKEND_URL + id)
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(id: string, title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(["/"])
      });

  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
   
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
     postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator:null
      }
    }

    this.http.put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"])
      })
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + postId)
  }


}