import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: any
  private mode = "create";
  private postId: any
  isLoading: boolean = false;
  form!: FormGroup;
  imagePreview: string | ArrayBuffer | null | undefined;
  url: any;

  constructor(public postService: PostService, public route: ActivatedRoute) { }
  //@Output() postCreated = new EventEmitter<Post>();

  ngOnInit(): void {
    this.form = new FormGroup({
      title:new FormControl(null, 
        {validators: [Validators.required, Validators.minLength(3)],
      }),
      content:new FormControl(null, 
        {validators: [Validators.required],
      }),
      image: new FormControl(null, 
        {validators: [Validators.required], asyncValidators: [mimeType]})
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = "edit";

        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.post = this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false
          this.post = { 
            id: postData._id, 
            title: postData.title, 
            content: postData.content,
            imagePath: postData.imagePath
          }
          this.form.setValue({
            title:this.post.title,
            content:this.post.content,
            image:this.post.imagePath
          })
        })
      } else {
        this.mode = "create";
        this.postId = null;
      }
    })
  }

  onSavePost() {
    // if (this.form.invalid) {
    //   return;
    // }
    this.isLoading = true;
    if (this.mode === "create") {
      console.log('save podt',this.form.value)
      this.postService.addPost(this.form.value.id, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    else {
      this.postService.updatePost(
        this.postId, 
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image);
    }
    this.form.reset()

  }

  onImagePicked(event:any){
    if (event.target.files && event.target.files[0]) {

      this.form.patchValue({image: event.target.files[0]});
      this.form.get('image')?.updateValueAndValidity();
      var reader = new FileReader();

  
      reader.onload = () => { // called once readAsDataURL is completed
        this.url = reader.result;
      }
      reader.readAsDataURL(event.target.files[0]); // read file as data url

    }
  }


  getErrorMessage() {

  }
}