import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: any

  // {
  //    id:'',
  //    title:"",
  //    content:''
  // }
  private mode = "create";
  private postId: any
  //post: any;

  constructor(public postService: PostService, public route: ActivatedRoute) { }
  //@Output() postCreated = new EventEmitter<Post>();

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = "edit";

        this.postId = paramMap.get('postId');
        this.post = this.postService.getPost(this.postId).subscribe(postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content }
        })
      } else {
        this.mode = "create";
        this.postId = null;
      }
    })
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === "create") {
      this.postService.addPost(form.value.id, form.value.title, form.value.content);

    }
    else {
      this.postService.updatePost(this.postId, form.value.title, form.value.content);
    }
    //form.resetForm()

  }



  getErrorMessage() {

  }
}