import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';


@Component({
    templateUrl: 'build/pages/my-time/working-step-detail/working-step-detail.html'
})
export class WorkingStepDetail {

    workingStep;

    constructor(private navParams: NavParams) {
        this.workingStep = navParams.data;
    }
}
