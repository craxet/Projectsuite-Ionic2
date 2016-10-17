import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';
import {API_ENDPOINT} from '../../constants/app-settings.ts';
import {BookingType} from "../../enums/enums";

@Injectable()
export class BookingsService {

    constructor(private http: Http) {
    }

    packBookingsToFormat(bookings) {
        let list = [];
        let totalSum = 0;
        //group working steps by date
        const grouped = _.groupBy(bookings, 'date');
        _.forIn(grouped, (value, key)=> {
            let sumOfDuration = _.sumBy(value, 'duration');
            totalSum += sumOfDuration;
            list.push({date: parseInt(key), sumOfDuration: sumOfDuration, values: value});
        });
        const firstLast = list.length === 0 ? null : {
            first: moment(parseInt(_.minBy(list, 'date').date)),
            last: moment(parseInt(_.maxBy(list, 'date').date))
        }
        return {
            list: list,
            totalSum: totalSum,
            firstLast: firstLast
        }
    }

    getBookings(bookingType: BookingType, from: Moment, to: Moment, inclBooked: boolean) {
        // allTenants: false
        const bookingUrl = bookingType == BookingType.SUMMARY ? '/summaryEntries' : '/workingSteps';
        return this.http.get(API_ENDPOINT + bookingUrl).map(res => {
            let query = _.filter(res.json(), (item: any) => {
                let dateQuery = from.toDate().getTime() <= item.date && item.date <= to.toDate().getTime();
                if (!inclBooked) {
                    return dateQuery && item.booked === false;
                } else {
                    return dateQuery;
                }
            });
            return this.packBookingsToFormat(query);
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        });
    }

}

