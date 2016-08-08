import {Component} from '@angular/core';
import {ViewController, ModalController} from 'ionic-angular';
import * as moment from 'moment';

import {MyTimeService} from '../my-time.service';
import {TaskSelection} from '../../../components/task-selection/task-selection';

@Component({
    templateUrl: 'build/pages/my-time/new-booking/new-booking.html',
    providers: [MyTimeService]
})

export class NewBooking {

    bookingDate: String;

    constructor(private modalCtrl: ModalController, private viewCtrl: ViewController, private myTimeService: MyTimeService) {
        this.bookingDate = moment().format('DD.MM.YYYY');
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    selectTask() {
        let modal = this.modalCtrl.create(TaskSelection);
        modal.present();
        modal.onDidDismiss(data => {
            console.log(data);
        });
    }

}