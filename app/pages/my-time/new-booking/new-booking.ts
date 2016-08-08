import {Component} from '@angular/core';
import {Modal,ViewController} from 'ionic-angular';

import {MyTimeService} from '../my-time.service';

@Component({
    templateUrl: 'build/pages/my-time/new-booking/new-booking.html',
    providers: [MyTimeService]
})

export class NewBooking {

    bookingDate: Date;

    constructor(private viewCtrl:ViewController, private myTimeService:MyTimeService) {
        this.bookingDate = new Date();
    }

    cancel(){
        this.viewCtrl.dismiss();
    }

}