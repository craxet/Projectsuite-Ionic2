import {Component} from '@angular/core';
import {Modal, NavController, ViewController} from 'ionic-angular';

@Component({
    templateUrl: 'build/components/working-step-more/working-step-more-modal.html'
})
export class WorkingStepMoreModal {

    inclBooked: boolean = false;

    constructor(private viewCtrl: ViewController) {}

    cancel() {
        this.viewCtrl.dismiss({inclBooked: this.inclBooked});
    }
}