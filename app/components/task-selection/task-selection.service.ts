import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import * as _ from 'lodash';
import {Moment} from 'moment';

@Injectable()
export class TaskSelectionService {
    constructor(private http: Http) {
    }

    getTasksByGroup(date: Moment, taskGoup: string) {
        return this.get('test-data/tasks.json').map(res => {
            let body = res.json();
            switch (taskGoup) {
                case 'myTasks':
                        return _.take(body.data,5);
                case 'lastBookedTasks':
                    return _.takeRight(body.data,4);
                case 'globalTasks':
                    return [];
                case 'teamTasks':
                    return [];
            }
        })
    }

    /*getWorkingSteps(from:Moment, to:Moment, inclBooked:boolean, memberId:String, tenant:string) {
     // allTenants: false
     return this.http.get('test-data/working-steps.json').map(res => {
     let body = res.json();
     let query = _.chain(body.data).filter(function (item) {
     return from.toDate().getTime() <= item.date && item.date <= to.toDate().getTime();
     }).groupBy('date').value();
     let list = [];
     _.forIn(query, function (value, key) {
     list.push({date: key, values: value});
     });
     return list;
     }).catch(error =>{console.log('service',error); return Observable.throw(error);});
     }*/
}