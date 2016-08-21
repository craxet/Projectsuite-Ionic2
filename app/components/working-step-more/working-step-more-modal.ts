import {Component} from '@angular/core';
import {Modal, NavController, NavParams, ViewController} from 'ionic-angular';
import {Moment} from 'moment';
import {DateFormatPipe} from 'angular2-moment';

import {DurationPipe} from '../../pipes/duration-pipe.ts';

@Component({
    templateUrl: 'build/components/working-step-more/working-step-more-modal.html',
    pipes: [DurationPipe,DateFormatPipe]
})
export class WorkingStepMoreModal {

    inclBooked: boolean = false;
    firstLastDateOfWorkingSteps: {first: Moment, last: Moment};
    totalSumOfWorkingSteps: number;

    constructor(private params: NavParams, private viewCtrl: ViewController) {
        this.inclBooked = params.get('inclBooked');
        this.firstLastDateOfWorkingSteps = params.get('firstLastDateOfWorkingSteps');
        this.totalSumOfWorkingSteps = params.get('totalSumOfWorkingSteps');
    }

    cancel() {
        this.viewCtrl.dismiss({inclBooked: this.inclBooked});
    }
}