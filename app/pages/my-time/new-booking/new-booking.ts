import {Component} from '@angular/core';
import {ViewController, ModalController, PickerController, ActionSheetController} from 'ionic-angular';
import * as moment from 'moment';

import {MyTimeService} from '../my-time.service';
import {TaskSelection} from '../../../components/task-selection/task-selection';
import {DurationTypePipe} from '../../../pipes/duration-type-pipe';

enum DurationType{
    HOURS = <any>'hours', MINUTES = <any>'minutes', NONE = <any>'none'
}

@Component({
    templateUrl: 'build/pages/my-time/new-booking/new-booking.html',
    providers: [MyTimeService],
    pipes: [DurationTypePipe]
})
export class NewBooking {

    bookingDate: string;
    duration: number;
    durationType: DurationType = DurationType.HOURS;
    durationTemp: string;
    task: Object = null;

    constructor(private actionSheetController: ActionSheetController, private pickerCtrl: PickerController, private modalCtrl: ModalController, private viewCtrl: ViewController, private myTimeService: MyTimeService) {
        this.bookingDate = moment().toISOString();
        this.durationTemp = '0.25';
        this.duration = 0.25;
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    selectTask() {
        let modal = this.modalCtrl.create(TaskSelection,{task: this.task});
        modal.present();
        modal.onDidDismiss(data => {
            if (data !== null) {
                this.task = data;
            }

        });
    }

    //TODO duration value in input field ist not mapped after picker will be opened
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
                this.durationTemp = this.durationType == DurationType.MINUTES ? (data.duration.value / 60).toFixed(2) : data.duration.value.toString();
            }
        });
        picker.addColumn({
            name: 'duration',
            options: this.generateDurationValues(this.durationType)
        });
        picker.present();
    }

    openDurationTypeActionSheet() {
        let actionSheet = this.actionSheetController.create({
            title: 'Duration Type',
            buttons: [
                {
                    text: 'Hours',
                    handler: () => {
                        if (this.durationType == DurationType.MINUTES) {
                            this.duration /= 60;
                            this.durationType = DurationType.HOURS
                        }
                    }
                }, {
                    text: 'Minutes',
                    handler: () => {
                        if (this.durationType == DurationType.HOURS) {
                            this.duration *= 60;
                            this.durationType = DurationType.MINUTES
                        }
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                }
            ]
        });
        actionSheet.present();
    }

    formatDuration(duration){
        return this.durationType === DurationType.HOURS ? duration.toFixed(2) : duration;
    }

    selectedDurationSegment(value) {
        this.duration = this.durationType == DurationType.MINUTES ? value * 60 : value;
    }

    //value is always in hours but text is either in hours or minutes
    private generateDurationValues(durationType: DurationType) {
        let array = [];
        let count = durationType == DurationType.HOURS ? 0.25 : 1;
        const max = durationType == DurationType.HOURS ? 24 : 1415.4;
        let i = count;
        for (i; i < max; i += count) {
            array.push({text: durationType == DurationType.HOURS ? i.toFixed(2) : i, value: i});
        }
        return array;
    }
}