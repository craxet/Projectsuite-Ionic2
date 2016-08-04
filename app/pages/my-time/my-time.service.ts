import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

import * as _ from 'lodash';
import {Moment} from 'moment';

@Injectable()
export class MyTimeService {
    constructor(private http:Http) {
    }

    getWorkingSteps(from:Moment, to:Moment, inclBooked:boolean, memberId:String, tenant:string):Observable<any> {
        // allTenants: false
        return this.http.get('/working-steps.json').map(this.filterData).catch(this.handleError);
    }

    filterData(res:Response) {
        let body = res.json();

        let query = _.chain(body.data).filter(function (item) {
            return this.from.toDate().getTime() <= item.date && item.date <= this.to.toDate().getTime();
        }).groupBy('date').value();
        let list = [];
        _.forIn(query, function (value, key) {
            list.push({date: key, values: value});
        });
        return list;
    }

    handleError(error:any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}