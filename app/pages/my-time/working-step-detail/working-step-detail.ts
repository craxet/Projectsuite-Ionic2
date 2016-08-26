import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {DateFormatPipe} from 'angular2-moment';

import {DurationPipe} from '../../../pipes/duration-pipe';

@Component({
    templateUrl: 'build/pages/my-time/working-step-detail/working-step-detail.html',
    pipes:[DateFormatPipe,DurationPipe]
})
export class WorkingStepDetail {

    workingStep;

    constructor(private navParams: NavParams) {
        this.workingStep = navParams.data;
    }
}
