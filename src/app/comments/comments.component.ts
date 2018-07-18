import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  	selector: 'app-comments',
  	templateUrl: './comments.component.html',
  	styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
	public comments: any = [];

  	constructor(
  		private http: HttpClient,
    	public dialogRef: MatDialogRef<CommentsComponent>,
    	@Inject(MAT_DIALOG_DATA) public data) {}

  	ngOnInit() {
		this.data.story.kids.forEach((val, idx) => {
            this.http.get(`https://hacker-news.firebaseio.com/v0/item/${val}.json`).subscribe(data => {
              this.comments.push(data);
            });
        });
	}

  	onNoClick(): void {
    	this.dialogRef.close();
  	}

}
