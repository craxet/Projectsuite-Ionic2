import {
    LoadingController, ModalController, AlertController, NavController
} from 'ionic-angular';

import {BookingsPage} from "../bookings/bookings";
import {BookingsService} from '../../providers/bookings-service/bookings-service.ts';
import {BookingType} from "../../enums/enums";
import {MyTimeService} from "../my-time/my-time.service";


export class SummaryPage extends BookingsPage {


    constructor(protected navCtrl: NavController, protected loadingCtrl: LoadingController, protected alertCtrl: AlertController, protected modalCtrl: ModalController, protected  bookingsService: BookingsService, protected myTimeService: MyTimeService) {
        super(navCtrl, loadingCtrl, alertCtrl, modalCtrl, bookingsService, myTimeService);
        super.setBookingType(BookingType.SUMMARY);
    }

}