import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../service/blog.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit {
  blogInfo: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _service: BlogService
  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id');
      //Get product info -> Call API
      this.loadData(id);
    });
  }

  loadData(id: any) {
    this._service.getBlogInfo(id).subscribe({
      next: (data) => {
        this.blogInfo = data;
        // console.log(this.blogInfo);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
