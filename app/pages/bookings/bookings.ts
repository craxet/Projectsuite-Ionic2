import {
    LoadingController, ModalController, AlertController, Refresher, NavController
} from 'ionic-angular';
import {Component} from '@angular/core';
import {Moment} from 'moment';
import * as moment from 'moment';

import {DateFormatPipe} from 'angular2-moment';
import {DurationPipe} from '../../pipes/duration-pipe';
import {OrderByPipe} from '../../pipes/order-by-pipe';

import {WorkingStep} from '../my-time/working-step/working-step';
import {BookingsService} from '../../providers/bookings-service/bookings-service.ts';
import {BookingMore} from '../../components/booking-more/booking-more';
import {BookingDetail} from '../my-time/booking-detail/booking-detail';
import {CalendarView} from '../../components/calendar-view/calendar-view';
import {Booking} from  '../../models/booking';
import {BookingType} from "../../enums/enums";
import {MyTimeService} from "../my-time/my-time.service";


@Component({
    templateUrl: 'build/pages/bookings/bookings.html',
    pipes: [DateFormatPipe, DurationPipe, OrderByPipe],
    directives: [CalendarView],
    providers: [BookingsService, MyTimeService]
})
export class BookingsPage {

    newWorkingStepId = null;
    selectedDate: {from: Moment, to: Moment};
    bookings: Array<Booking> = [];
    bookingsMore: {inclBooked: boolean,totalSumOfBookings: number,datesOfBookingsView: {first: Moment,last: Moment}};
    isLoading: boolean = false;
    bookingsLabel: string;
    bookingType: BookingType;
    isMyTime;
    bookingTitle;

    constructor(protected navCtrl: NavController, protected loadingCtrl: LoadingController, protected alertCtrl: AlertController, protected modalCtrl: ModalController, protected  bookingsService: BookingsService, protected myTimeService: MyTimeService) {
        this.bookingsMore = {
            inclBooked: false,
            totalSumOfBookings: 0,
            datesOfBookingsView: {first: moment(), last: moment()}
        };
    }

    setBookingType(bookingType) {
        this.bookingType = bookingType;
        this.bookingTitle = bookingType == BookingType.SUMMARY ? 'Summary' : 'My Time';
        this.isMyTime = bookingType == BookingType.SUMMARY ? false : true;
        this.bookingsLabel = bookingType == BookingType.SUMMARY ? 'Summary' : 'Working Steps';
    }

    gotToBookingDetail(booking) {
        this.navCtrl.push(BookingDetail, booking);
    }


    openMoreModal() {
        let modal = this.modalCtrl.create(BookingMore, {
            inclBooked: this.bookingsMore.inclBooked,
            selectedDate: this.selectedDate,
            totalSumOfBookings: this.bookingsMore.totalSumOfBookings,
            datesOfBookingsView: this.bookingsMore.datesOfBookingsView,
            bookingsLabel: this.bookingsLabel
        });
        modal.present();
        modal.onDidDismiss(data => {
            if (this.bookingsMore.inclBooked !== data.inclBooked) {
                this.bookingsMore.inclBooked = data.inclBooked;
                this.getBookings();
            }
        });
    }

    callGetBookings(selectedDate) {
        this.selectedDate = selectedDate;
        this.getBookings();
    }

    getBookings(refresher: Refresher = null) {
        this.isLoading = refresher === null ? true : false;
        this.bookingsService.getBookings(this.bookingType, this.selectedDate.from, this.selectedDate.to, this.bookingsMore.inclBooked).subscribe(
            data => {
                this.bookings = data.list;
                this.bookingsMore.totalSumOfBookings = data.totalSum;
                this.bookingsMore.datesOfBookingsView = data.firstLast;
                this.isLoading = false;
                refresher && refresher.complete();
            },
            error => {
                console.log(error);
                this.isLoading = false;
                refresher && refresher.complete();
            }
        );
    }

    getLoadedBookings() {
        this.bookings;
    }

    setPropertiesFromCreateBooking(bookings, totalSumOfBookings, datesOfBookingsView) {
        this.bookings = bookings;
        this.bookingsMore.totalSumOfBookings = totalSumOfBookings;
        this.bookingsMore.datesOfBookingsView = datesOfBookingsView;
    }


    createBooking() {
        let modal = this.modalCtrl.create(WorkingStep, {selectedDate: this.selectedDate});
        modal.onDidDismiss((data)=> {
            if (data) {
                this.newWorkingStepId = data.id;
                const recomputed = this.myTimeService.addWorkingStepToList(data, this.bookings);
                this.bookings = recomputed.list;
                this.bookingsMore.totalSumOfBookings = recomputed.totalSum;
                this.bookingsMore.datesOfBookingsView = recomputed.firstLast;
                this.newWorkingStepId = null;
            }
        });
        modal.present();
    }

    deleteWorkingStep(workingStep) {
        let loader = this.loadingCtrl.create({
            content: 'Deleting...'
        });
        let prompt = this.alertCtrl.create({
            title: 'Delete',
            message: "Do you really want to delete the Working Step",
            buttons: [
                {
                    text: 'No, I do not',
                    role: 'cancel',
                },
                {
                    text: 'Yes, I do',
                    handler: ()=> {
                        loader.present();
                        this.myTimeService.deleteWorkingStep(workingStep).subscribe(() => {
                            this.myTimeService.deleteWorkingStepFromList(workingStep, this.getBookings());
                            loader.dismiss();
                        }, error=> {
                            loader.dismiss();
                            console.log(error);
                        });
                    }
                }
            ]
        });
        prompt.present();
    }

    editWorkingStep(step) {
        let modal = this.modalCtrl.create(WorkingStep, {workingStep: step});
        modal.onDidDismiss((data)=> {
            if (data) {
                //TODO create function that add edit working step to array on right position;
                // this.workingSteps.push(data);
                this.getBookings();
            }
        });
        modal.present();
    }

    ionViewWillEnter() {
        this.getBookings();
    }
}
