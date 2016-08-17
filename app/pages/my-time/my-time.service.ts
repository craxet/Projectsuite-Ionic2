import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import * as _ from 'lodash';
import {Moment} from 'moment';

import {WorkingStepsData} from './working-steps-test-data';

@Injectable()
export class MyTimeService {

    workingSteps = WorkingStepsData;

    constructor(private http: Http) {
    }

    getWorkingSteps(from: Moment, to: Moment, inclBooked: boolean, memberId: String, tenant: string) {
        // allTenants: false
        //TODO temporary without observable
        /* return this.http.get('test-data/working-steps.json').map(res => {
         let body = res.json();
         let query = _.chain(body.data).filter(function (item) {
         return from.toDate().getTime() <= item.date && item.date <= to.toDate().getTime();
         }).groupBy('date').value();
         let list = [];
         _.forIn(query, function (value, key) {
         list.push({date: key, values: value});
         });
         return list;
         }).catch(error => {
         console.log('service', error);
         return Observable.throw(error);
         });*/
        let list = [];
        setTimeout(()=> {
            let query = _.chain(this.workingSteps).filter(function (item) {
                return from.toDate().getTime() <= item.date && item.date <= to.toDate().getTime();
            }).groupBy('date').value();
            _.forIn(query, function (value, key) {
                list.push({date: parseInt(key), values: value});
            });
        }, 1500);

        return list;
    }

    removeWorkingStep(workingStep) {
        //TODO temporary service
        return workingStep;
    }
}