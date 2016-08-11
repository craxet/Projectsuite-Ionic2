import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import * as moment from 'moment';

import {TaskSelectionService} from 'task-selection.service';
import {TaskGroup} from '../../enums/enums';

@Component({
    templateUrl: 'build/components/task-selection/task-selection.html',
    providers:[TaskSelectionService]
})
export class TaskSelection implements OnInit {

    taskGroup: TaskGroup = TaskGroup.MY_TASKS;
    tasks: Array<any> = [];

    constructor(private viewCtrl: ViewController, private taskSelectionService: TaskSelectionService) {
    }

    cancel() {
        this.viewCtrl.dismiss(null);
    }

    selectedTaskGroup() {

    }

    selectTask(task) {
        this.viewCtrl.dismiss(task);
    }

    getTasks(){
       this.tasks = this.taskSelectionService.getTasksByGroup(moment(),this.taskGroup);
    }

    ngOnInit() {
        this.getTasks();
    }
}