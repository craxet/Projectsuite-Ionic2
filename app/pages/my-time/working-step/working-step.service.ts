import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import {Moment} from  'moment';
import * as moment from 'moment';
import {API_ENDPOINT} from "../../../constants/app-settings";

@Injectable()
export class WorkingStepService {
    constructor(private http: Http) {
    }

    getTaskCategoriesAndAssigments(task: Object, date: string) {
        return Observable.forkJoin(this.http.get(API_ENDPOINT + '/taskCategories').map(res => {
            return res.json();
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        }), this.http.get(API_ENDPOINT + '/taskAssigments').map(res => {
            return res.json();
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        }));
    }
}