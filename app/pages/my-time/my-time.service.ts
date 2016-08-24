import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import * as _ from 'lodash';
import * as moment from 'moment';
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
        return this.http.get('http://localhost:3000/workingSteps').map(res => {
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
            return {
                list: list,
                totalSum: totalSum,
                firstLast: {
                    first: moment(parseInt(_.minBy(list, 'date').date)),
                    last: moment(parseInt(_.maxBy(list, 'date').date))
                }
            };
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        });
    }

    deleteWorkingStep(workingStep) {
        return this.http.delete('http://localhost:3000/workingSteps/' + workingStep.id).map(() => {
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        });
    }

    editWorkingStep(workingStep){
        let req ={

        };
        return this.http.put('http://localhost:3000/workingSteps/',req).map(()=>{
            return req;
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        });
    }

    createWorkingStep(newWorkingStep) {
        //TODO taskId property was renamed to task because of json-server
        let req = {
            id: moment().toISOString(),
            date: moment(newWorkingStep.bookingDate).toDate().getTime(),
            taskName: newWorkingStep.task.name,
            projectName: newWorkingStep.task.project.name,
            tenant: 'A',
            duration: newWorkingStep.duration,
            durationType: 1,
            category: newWorkingStep.taskCategory,
            activity: newWorkingStep.activity,
            booked: false,
            task: newWorkingStep.task.id,
            number: '1234'
        }
        return this.http.post('http://localhost:3000/workingSteps/', req).map(()=> {
            return req;
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        });
    }
}