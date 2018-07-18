import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  	selector: 'app-top',
  	templateUrl: './top.component.html',
  	styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
	public stories: any = [];
	public paginator: any = {
		total: 0,
		pageSize: 50,
		firstItem: 0,
		lastItem: 50,
		page: 0
	};

  	constructor(
  		private http: HttpClient,
  		public dialog: MatDialog
  	) { }

  	ngOnInit() {
  		this.getStories(undefined);
  	}

  	pageEvent (event) {
  		this.getStories(event.pageIndex);
  	}

  	getStories(page) {
  		this.stories = [];

  		this.http.get('https://hacker-news.firebaseio.com/v0/beststories.json').subscribe(data => {
  			this.paginator.total = data.length;

  			if (Number.isInteger(page)) {
	  			if (page > this.paginator.page) {
			    	this.paginator.firstItem = this.paginator.lastItem;
			    	this.paginator.lastItem += 50;
			    } else {
			    	this.paginator.lastItem = this.paginator.firstItem;
			    	this.paginator.firstItem -= 50;
			    }

			    this.paginator.page = page;
			}

		    data.slice(this.paginator.firstItem, this.paginator.lastItem).forEach((val, idx) => {
		    	this.http.get(`https://hacker-news.firebaseio.com/v0/item/${val}.json`).subscribe(data => {
				    this.stories.push(data);
				});
		    });
		});
  	}

  	openDialog(story): void {
	    const dialogRef = this.dialog.open(CommentsComponent, {
	      	height: '400px',
  			width: '600px',
	      	data: {story: story}
	    });
  	}

}