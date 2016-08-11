import {Component, OnInit} from '@angular/core';
import {ViewController,AlertController} from 'ionic-angular';
import * as moment from 'moment';

import {TaskSelectionService} from './task-selection.service';
import {TaskGroup} from '../../enums/enums';

@Component({
    templateUrl: 'build/components/task-selection/task-selection.html',
    providers: [TaskSelectionService]
})
export class TaskSelection implements OnInit {

    taskGroup: TaskGroup = TaskGroup.MY_TASKS;
    tasks: Array<any> = [];
    selectedTask: any = null;
    selectedTaskTemp;

    constructor(private viewCtrl: ViewController,private alertCtrl: AlertController,private taskSelectionService: TaskSelectionService) {
    }

    cancel() {
        this.viewCtrl.dismiss(null);
    }

    selectedTaskGroup() {

    }

    selectTask() {
        if (this.selectedTask === null) {
            let alert = this.alertCtrl.create({
                title: 'No Task selected',
                subTitle: 'Select a Task from the list please!',
                buttons: ['OK']
            });
            alert.present();
        } else {
            this.viewCtrl.dismiss(this.selectedTask);
        }
    }

    selectRadioTaskItem(task){
        this.selectedTask = task;
    }

    getTasks() {
        this.taskSelectionService.getTasksByGroup(moment(), this.taskGroup).subscribe(
            data => this.tasks = data,
            error => {
                console.log('getTasks',error)
            });
    }

    ngOnInit() {
        this.getTasks();
    }
}