import {
    LoadingController, ModalController, AlertController, NavController
} from 'ionic-angular';

import {BookingsPage} from "../bookings/bookings";
import {BookingsService} from '../../providers/bookings-service/bookings-service';
import {BookingType} from "../../enums/enums";
import {WorkingStepService} from "../../providers/working-step-service/working-step-service";


export class SummaryPage extends BookingsPage {


    constructor(protected navCtrl: NavController, protected loadingCtrl: LoadingController, protected alertCtrl: AlertController, protected modalCtrl: ModalController, protected  bookingsService: BookingsService, protected workingStepService: WorkingStepService) {
        super(navCtrl, loadingCtrl, alertCtrl, modalCtrl, bookingsService, workingStepService);
        super.setBookingType(BookingType.SUMMARY);
    }

}