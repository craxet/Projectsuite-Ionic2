import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import * as moment from 'moment';

@Component({
    templateUrl: 'build/components/task-selection/task-selection.html'
})
export class TaskSelection {

    taskGroup: String;

    constructor(private viewCtrl:ViewController) {}

    cancel(){
        this.viewCtrl.dismiss(null);
    }

    selectedTaskGroup(){

    }

    selectTask(task){
        this.viewCtrl.dismiss(task);
    }

}