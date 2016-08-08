import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import * as moment from 'moment';

import {MyTimeService} from '../my-time.service';

@Component({
    templateUrl: 'build/pages/my-time/new-booking/new-booking.html',
    providers: [MyTimeService]
})

export class NewBooking {

    bookingDate: String;

    constructor(private viewCtrl:ViewController, private myTimeService:MyTimeService) {
        this.bookingDate = moment().format('DD.MM.YYYY');
    }

    cancel(){
        this.viewCtrl.dismiss();
    }

}