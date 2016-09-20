import {Component,OnInit} from '@angular/core';
import {Refresher, NavController, ModalController} from 'ionic-angular';
import {Moment} from 'moment';

import {CalendarView} from '../../components/calendar-view/calendar-view';
import {SummaryService} from './summary.service';
import {BookingDetail} from '../my-time/booking-detail/booking-detail';
import {BookingMore} from '../../components/booking-more/booking-more';
import {OrderByPipe} from '../../pipes/order-by-pipe';
import {DurationPipe} from '../../pipes/duration-pipe';
import {DateFormatPipe} from 'angular2-moment';


@Component({
    templateUrl: 'build/pages/summary/summary.html',
    directives: [CalendarView],
    providers: [SummaryService],
    pipes:[OrderByPipe,DateFormatPipe,DurationPipe]
})

export class SummaryPage{

    selectedDate: {from: Moment, to: Moment};
    summaryEntries: Array<any> = [];
    totalSumOfSummaryEntries: number;
    firstLastDateOfSummaryEntries: {first: Moment, last: Moment};
    inclBooked: boolean = false;
    tenant: string = null;
    memberId: string = null;
    selectedDateClass: boolean = false;
    areSummaryEntriesLoading: boolean = false;

    constructor(private modalCtrl: ModalController,private nav: NavController, private summaryService: SummaryService) {
    }

    gotToSummaryEntryDetail(summaryEntry) {
        this.nav.push(BookingDetail, summaryEntry);
    }

    openMoreModal() {
        let modal = this.modalCtrl.create(BookingMore, {
            inclBooked: this.inclBooked,
            selectedDate: this.selectedDate,
            totalSumOfBookings: this.totalSumOfSummaryEntries,
            firstLastDateOfBookings: this.firstLastDateOfSummaryEntries,
            bookingsLabel: 'Bookings'
        });
        modal.present();
        modal.onDidDismiss(data => {
            if (data && this.inclBooked !== data.inclBooked) {
                this.inclBooked = data.inclBooked;
                this.getSummaryEntries();
            }
        });
    }

    callGetSummaryEntries(selectedDate) {
        this.selectedDate = selectedDate;
        this.getSummaryEntries();
    }

    getSummaryEntries(refresher: Refresher = null) {
        this.areSummaryEntriesLoading = refresher === null ? true : false;
        this.summaryService.getSummaryEntries(this.selectedDate.from, this.selectedDate.to, this.inclBooked).subscribe(
            data=> {
                this.summaryEntries = data.list;
                this.totalSumOfSummaryEntries = data.totalSum;
                this.firstLastDateOfSummaryEntries = data.firstLast;
                this.areSummaryEntriesLoading = false;
                refresher && refresher.complete();
            }, error=> {
                console.log(error);
                this.areSummaryEntriesLoading = false;
                refresher && refresher.complete();
            });
    }

    ionViewWillEnter(){
        this.getSummaryEntries();
    }
}