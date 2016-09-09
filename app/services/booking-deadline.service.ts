import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import * as moment from 'moment';

@Injectable()
export class BookingDeadlineService {

    constructor(private http: Http) {
    }

    getBookingDeadline() {
        return this.http.get('/api/bookingDeadline').map(res => {
            return {date: moment(res.json().date).add(1, 'day')};
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        })
    }
}
