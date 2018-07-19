import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DbService } from '../db.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {
	public story: any = {};
  public comments: any = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient,
    private db: DbService
	) { }

	ngOnInit() {
		let id = this.route.snapshot.paramMap.get('id');

    this.db.openDb().then(() => {
      this.db.getByKey(id).then((item) => {
          if (item) {
            this.story = item;
            if (this.story.kids.length) {
              this.story.kids.forEach((val, idx) => {
                this.http.get(`https://hacker-news.firebaseio.com/v0/item/${val}.json`).subscribe(data => {
                  this.comments.push(data);
                });
              });
            }
          } else {
            this.router.navigate(['/404']);
          }
      }, (error) => {
          console.log(error);
      });
    });
	}

}
