import {Component} from '@angular/core';
import {Modal, NavController, NavParams, ViewController} from 'ionic-angular';
import {Moment} from 'moment';
import {DateFormatPipe} from 'angular2-moment';

import {DurationPipe} from '../../pipes/duration-pipe.ts';

@Component({
    templateUrl: 'build/components/booking-more/booking-more.html',
    pipes: [DurationPipe, DateFormatPipe]
})
export class BookingMore {

    inclBooked: boolean = false;
    firstLastDateOfBookings: {first: Moment, last: Moment};
    totalSumOfBookings: number;
    bookingsLabel: string;

    constructor(private params: NavParams, private viewCtrl: ViewController) {
        this.inclBooked = params.get('inclBooked');
        this.firstLastDateOfBookings = params.get('firstLastDateOfBookings');
        this.totalSumOfBookings = params.get('totalSumOfBookings');
        this.bookingsLabel = params.get('bookingsLabel');
    }

    cancel() {
        this.viewCtrl.dismiss({inclBooked: this.inclBooked});
    }
}