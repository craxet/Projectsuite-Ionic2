import {Component, OnInit} from '@angular/core';
import {ViewController, AlertController, NavParams, LoadingController, Refresher} from 'ionic-angular';
import {DateFormatPipe} from 'angular2-moment';
import * as moment from 'moment';
import * as _ from 'lodash';

import {TaskSelectionService} from './task-selection.service';
import {TaskGroup} from '../../enums/enums';

@Component({
    templateUrl: 'build/components/task-selection/task-selection.html',
    providers: [TaskSelectionService],
    pipes: [DateFormatPipe]
})
export class TaskSelection implements OnInit {

    taskGroup: TaskGroup = TaskGroup.MY_TASKS;
    tasks: Array<any> = [];
    selectedTask: any = null;
    selectedTaskTemp;
    isLoading: boolean = false;

    constructor(private params: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController, private taskSelectionService: TaskSelectionService) {
    }

    cancel() {
        this.viewCtrl.dismiss(null);
    }

    selectedTaskGroup() {
        this.getTasks();
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
            if (!this.selectedTask.bookable) {
                let alert = this.alertCtrl.create({
                    title: 'Not bookable Task',
                    subTitle: 'Task <strong>' + this.selectedTask.name + '</strong> is not bookable',
                    buttons: ['OK']
                });
                alert.present();
            } else {
                this.viewCtrl.dismiss(this.selectedTask);
            }
        }
    }

    selectRadioTaskItem(task) {
        this.selectedTask = task;
    }


    getTasks(refresher?: Refresher) {
        this.isLoading = _.isUndefined(refresher) ? true : false;
        this.taskSelectionService.getTasksByGroup(moment(), this.taskGroup).subscribe(
            data => {
                this.tasks = _.map(data, (task: any)=> {
                    let taskParam = this.params.get('task');
                    task.checked = taskParam !== null && taskParam.id === task.id;
                    return task;
                });
                this.isLoading = false;
                refresher && refresher.complete();
            },
            error => {
                this.isLoading = false;
                console.log('getTasks', error)
            });
    }

    ngOnInit() {
        this.getTasks();
    }
}