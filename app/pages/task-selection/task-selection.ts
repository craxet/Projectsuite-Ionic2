import {
    Component, OnInit, trigger,
    state,
    style,
    animate,
    transition
} from '@angular/core';
import {ViewController, AlertController, NavParams, LoadingController, Refresher} from 'ionic-angular';
import {DateFormatPipe} from 'angular2-moment';
import * as moment from 'moment';

import {TaskSelectionService} from '../../providers/task-selection-service/task-selection-service';
import {TaskGroup} from '../../enums/enums';

@Component({
    templateUrl: 'build/pages/task-selection/task-selection.html',
    providers: [TaskSelectionService],
    pipes: [DateFormatPipe],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(1%)'})),
            transition('void => *', [
                style({transform: 'translateX(-100%)'}),
                animate(100)
            ]),
            transition('* => void', [
                animate(100, style({transform: 'translateX(100%)'}))
            ])
        ])
    ]
})
export class TaskSelectionPage {

    taskGroup: TaskGroup = TaskGroup.MY_TASKS;
    tasks: Array<any> = [];
    selectedTask: any = null;
    selectedTaskTemp;
    isLoading: boolean = false;
    searchedValue: string = '';

    private tasksCopy: Array<any> = [];

    constructor(private params: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController, private taskSelectionService: TaskSelectionService) {
        this.taskGroup = this.params.get('task') !== null ? this.params.get('task').taskGroup : this.taskGroup;
    }

    cancel() {
        this.viewCtrl.dismiss(null);
    }

    changedTaskGroup() {
        this.selectedTask = null;
        this.searchedValue = '';
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
                //store task group of selected task for repeated selection
                this.selectedTask.taskGroup = this.taskGroup;
                this.viewCtrl.dismiss(this.selectedTask);
            }
        }
    }

    selectRadioTaskItem(task) {
        this.selectedTask = task;
    }


    getTasks(refresher: Refresher = null) {
        this.isLoading = refresher === null ? true : false;
        this.taskSelectionService.getTasksByGroup(moment(), this.taskGroup).subscribe(
            data => {
                this.tasks = data.map((task: any)=> {
                    task.checked = this.params.get('task') !== null && this.params.get('task').id === task.id;
                    this.selectedTask = task.checked ? task : this.selectedTask;
                    return task;
                });
                this.tasksCopy = this.tasks.slice(0);
                this.isLoading = false;
                refresher && refresher.complete();
            },
            error => {
                this.isLoading = false;
                console.log('getTasks', error)
            });
    }

    searchTasksLocally() {
        this.isLoading = true;
        this.tasks = this.tasksCopy.slice(0);
        if (this.searchedValue.length !== 0) {
            this.tasks = this.tasksCopy.slice(0);
            //TODO if the size of tasks is large, you need to use spinner
            this.tasks = this.tasks.filter((task)=> {
                return (task.name.toLowerCase().indexOf(this.searchedValue.trim().toLowerCase()) > -1);
            });
        }
        this.isLoading = false;
    }

    ionViewWillEnter() {
        this.getTasks();
    }
}