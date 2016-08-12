import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import * as _ from 'lodash';
import {Moment} from 'moment';

import {TaskGroup} from '../../enums/enums';

@Injectable()
export class TaskSelectionService {
    constructor(private http: Http) {}

    //TODO there is a delay set
    getTasksByGroup(date: Moment, taskGroup: TaskGroup) {
        return this.http.get('test-data/tasks.json').delay(1000).map(res => {
            let body = res.json();
            switch (taskGroup) {
                case TaskGroup.MY_TASKS:
                    return _.take(body.data, 5);
                case TaskGroup.LAST_BOOKED_TASKS:
                    return _.takeRight(body.data, 4);
                case TaskGroup.GLOBAL_TASKS:
                    return [];
                case TaskGroup.TEAM_TASKS:
                    return [];
            }
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        })
    }
}