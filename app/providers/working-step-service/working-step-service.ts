import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable}     from 'rxjs/Observable';

import {API_ENDPOINT} from '../../constants/app-settings';

@Injectable()
export class WorkingStepService {

  constructor(private http: Http) {}

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

