import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';

@Injectable()
export class SummaryService {
    constructor(private http: Http) {
    }

    getSummaryEntries(from: Moment, to: Moment, inclBooked: boolean) {
        return this.http.get('/api/summaryEntries').map(res => {
            let query = _.chain(res.json()).filter(function (item) {
                let dateQuery = from.toDate().getTime() <= item.date && item.date <= to.toDate().getTime();
                if (!inclBooked) {
                    return dateQuery && item.booked === false;
                } else {
                    return dateQuery;
                }
            }).groupBy('date').value();
            let list = [];
            let totalSum = 0;
            _.forIn(query, function (value, key) {
                let sumOfDuration = _.sumBy(value, 'duration');
                totalSum += sumOfDuration;
                list.push({date: parseInt(key), sumOfDuration: sumOfDuration, values: value});
            });
            const firstLast = list.length === 0 ? null : {
                first: moment(parseInt(_.minBy(list, 'date').date)),
                last: moment(parseInt(_.maxBy(list, 'date').date))
            };
            return {
                list: list,
                totalSum: totalSum,
                firstLast: firstLast
            };

        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        });
    }

}