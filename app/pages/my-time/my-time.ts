import {
    LoadingController, ModalController, AlertController, Refresher, NavController, Content
} from 'ionic-angular';

import {WorkingStepService} from '../../providers/working-step-service/working-step-service';
import {BookingsPage} from "../bookings/bookings";
import {BookingsService} from "../../providers/bookings-service/bookings-service";
import {BookingType} from "../../enums/enums";


export class MyTimePage extends BookingsPage {

    constructor(protected navCtrl: NavController, protected loadingCtrl: LoadingController, protected alertCtrl: AlertController, protected modalCtrl: ModalController, protected  bookingsService: BookingsService, protected workingStepService: WorkingStepService) {
        super(navCtrl, loadingCtrl, alertCtrl, modalCtrl, bookingsService, workingStepService);
        super.setBookingType(BookingType.MY_TIME);
    }
}