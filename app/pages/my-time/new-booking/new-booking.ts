import {Component} from '@angular/core';
import {ViewController, ModalController, PickerController,ActionSheetController} from 'ionic-angular';
import * as moment from 'moment';

import {MyTimeService} from '../my-time.service';
import {TaskSelection} from '../../../components/task-selection/task-selection';

enum DurationType{
    HOURS = <any>'hours', MINUTES = <any>'minutes'
}

@Component({
    templateUrl: 'build/pages/my-time/new-booking/new-booking.html',
    providers: [MyTimeService]
})
export class NewBooking {

    bookingDate: String;
    duration: number;
    durationType: DurationType = DurationType.HOURS;

    constructor(private actionSheetController : ActionSheetController ,private pickerCtrl: PickerController, private modalCtrl: ModalController, private viewCtrl: ViewController, private myTimeService: MyTimeService) {
        this.bookingDate = moment().format('DD.MM.YYYY');
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

    openDurationPicker() {
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

    openDurationTypeActionSheet(){
        let actionSheet = this.actionSheetController.create({
            title: 'Duration Type',
            buttons: [
                {
                    text: 'Hours',
                    handler: () => {
                        this.durationType = DurationType.HOURS;
                    }
                },{
                    text: 'Minutes',
                    handler: () => {
                        this.durationType = DurationType.MINUTES;
                    }
                },{
                    text: 'Cancel',
                    role: 'cancel',
                }
            ]
        });
        actionSheet.present();
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