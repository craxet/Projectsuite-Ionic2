import {Component} from '@angular/core';
import {ViewController, ModalController, PickerController} from 'ionic-angular';
import * as moment from 'moment';

import {MyTimeService} from '../my-time.service';
import {TaskSelection} from '../../../components/task-selection/task-selection';

@Component({
    templateUrl: 'build/pages/my-time/new-booking/new-booking.html',
    providers: [MyTimeService]
})

export class NewBooking {

    bookingDate: String;
    duration: number;

    constructor(private pickerCtrl: PickerController, private modalCtrl: ModalController, private viewCtrl: ViewController, private myTimeService: MyTimeService) {
        this.bookingDate = moment().format('DD.MM.YYYY');
        // this.duration =
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

    openPicker() {
        let picker = this.pickerCtrl.create();
        picker.addButton({
            text: 'Cancel',
            role: 'cancel'
        });
        picker.addButton({
            text: 'Done',
            handler: (data) => {
                this.duration = data.duration.value;
            }
        });
        picker.addColumn({
            name: 'duration',
            options: this.generateDurationValues('minutes')
        });
        picker.present();
    }

    //value is always in hours but text is either in hours or minutes
    private generateDurationValues(type) {
        let array = [];
        let count = type === 'hours' ? 0.25 : 1;
        const max = type === 'hours' ? 24 : 1415.4;
        let i = count;
        for (i; i < max; i += count) {
            array.push({text: type === 'hours' ? i.toFixed(2) : i, value: i});
        }
        return array;
    }
}