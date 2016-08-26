import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import * as _ from 'lodash';
import {Moment} from 'moment';

@Injectable()
export class TaskSelectionService {
    constructor(private http: Http) {}

    getSummaryEntries(from: Moment, to:Moment) {
        return this.http.get('http://localhost:3000/summaryEntries').map(res => {
            let body = res.json();

        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        });
    }

}