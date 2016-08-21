import {Component} from '@angular/core';
import {Modal, NavController,NavParams,ViewController} from 'ionic-angular';

@Component({
    templateUrl: 'build/components/working-step-more/working-step-more-modal.html'
})
export class WorkingStepMoreModal {

    inclBooked: boolean = false;

    constructor(private params: NavParams,private viewCtrl: ViewController) {
        this.inclBooked = params.get('inclBooked');
    }

    cancel() {
        this.viewCtrl.dismiss({inclBooked: this.inclBooked});
    }
}