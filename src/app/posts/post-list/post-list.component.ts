import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';



@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

 posts:Post[] = [];

  constructor(public postService : PostService) { }

  ngOnInit(): void {
    this.posts = this.postService.getPosts()
  }

}
