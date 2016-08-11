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

    getTasksByGroup(date: Moment, taskGroup: TaskGroup) {
        return this.get('test-data/tasks.json').map(res => {
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
        })
    }
}