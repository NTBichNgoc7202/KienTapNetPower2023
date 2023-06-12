import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Blog } from '../models/blog';
import { BlogService } from '../service/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
 
  blog: Blog = new Blog();

  blogList: any;

  errMess: string = "";

  constructor(private _service: BlogService, private _router: Router) { }

  ngOnInit(): void {
    this.getBlogs()
  }
  getBlogs() {
    this._service.getBlogList().subscribe(
      {
        next: (data) => {
          this.blogList = data;
        },
        error: (err) => this.errMess = err.message
      }
    )
  }

  onSelect(id:any){
    this._router.navigate(['/blog-detail',id]);
  }

}
