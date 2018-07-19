import { Injectable } from '@angular/core';
import { AngularIndexedDB } from 'angular2-indexeddb';

@Injectable({
  	providedIn: 'root'
})
export class DbService {
	private db = new AngularIndexedDB('myDb', 1);

  	constructor() { }

  	openDb() {
  		return this.db.openDatabase(1, (evt) => {
		    let objectStore = evt.currentTarget.result.createObjectStore(
		        'items', { keyPath: "id"});
		});
  	}

  	getAll() {
  		return this.db.getAll('items');
  	}

  	getByKey(key) {
  		return this.db.getByKey('items', parseInt(key));
  	}

  	add(data) {
  		return this.db.add('items', data);
  	}
}
