import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { AngularIndexedDB } from 'angular2-indexeddb';
import { CommentsComponent } from '../comments/comments.component';
import { DbService } from '../db.service';

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
  		public dialog: MatDialog,
  		private db: DbService
  	) { 
  		
  	}

  	ngOnInit() {
  		this.getStories('');
  	}

  	pageEvent (event) {
  		this.getStories(event.pageIndex);
  	}

  	getStories(page) {
  		this.db.openDb().then(() => {
		    this.db.getAll().then((items) => {
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

		    	if (!items.length) {
			    	this.http.get('https://hacker-news.firebaseio.com/v0/beststories.json').subscribe(data => {
					    this.paginator.total = Object.keys(data).length;

					    for(var key in data) {
					    	this.http.get(`https://hacker-news.firebaseio.com/v0/item/${data[key]}.json`).subscribe(data2 => {
							    this.db.add(data2).then(() => {
							    	if (this.paginator.pageSize >= this.stories.length) {
							    		this.stories.push(data2);
							    	}
								}, (error) => {
								    console.log(error);
								});
							});
					    }
					});
			    } else {
			    	this.paginator.total = items.length;
			    	this.stories = items.slice(this.paginator.firstItem, this.paginator.lastItem);
			    }
			}, (error) => {
			    console.log(error);
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