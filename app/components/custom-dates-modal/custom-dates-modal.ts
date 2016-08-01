import {Component} from '@angular/core';
import {Modal, NavController,ViewController} from 'ionic-angular';

@Component({
    templateUrl: 'build/components/custom-dates-modal/custom-dates-modal.html'
})
export class CustomDatesModal {
    constructor(
        private viewCtrl: ViewController) {}

    close() {
        this.viewCtrl.dismiss();
    }
}