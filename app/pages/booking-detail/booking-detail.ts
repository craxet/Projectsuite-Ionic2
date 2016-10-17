import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {DateFormatPipe} from 'angular2-moment';

import {DurationPipe} from '../../pipes/duration-pipe';

@Component({
    templateUrl: 'build/pages/booking-detail/booking-detail.html',
    pipes:[DateFormatPipe,DurationPipe]
})
export class BookingDetailPage {

    booking;

    constructor(private navParams: NavParams) {
        this.booking = navParams.data;
    }
}
