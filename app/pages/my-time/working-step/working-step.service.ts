import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import {Moment} from  'moment';
import * as moment from 'moment';

@Injectable()
export class NewBookingService {
    constructor(private http: Http) {
    }

    getTaskCategoriesAndAssigments(task: Object, date: string) {
        return  Observable.forkJoin(this.http.get('http://localhost:3000/taskCategories').map(res => {
            return res.json();
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        }), this.http.get('http://localhost:3000/taskAssigments').map(res => {
            return res.json();
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        }));
    }
}