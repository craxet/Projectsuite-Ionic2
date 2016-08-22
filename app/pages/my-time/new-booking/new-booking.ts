import {Component, OnInit} from '@angular/core';
import {ViewController, ModalController, PickerController, ActionSheetController, AlertController} from 'ionic-angular';
import * as moment from 'moment';

import {MyTimeService} from '../my-time.service';
import {TaskSelection} from '../../../components/task-selection/task-selection';
import {DurationTypePipe} from '../../../pipes/duration-type-pipe';
import {BookingDeadlineService} from '../../../services/booking-deadline.service';
import {NewBookingService} from './new-booking.service';

enum DurationType{
    HOURS = <any>'hours', MINUTES = <any>'minutes', NONE = <any>'none'
}

@Component({
    templateUrl: 'build/pages/my-time/new-booking/new-booking.html',
    providers: [MyTimeService, BookingDeadlineService, NewBookingService],
    pipes: [DurationTypePipe]
})
export class NewBooking implements OnInit {

    bookingDate: string;
    minBookingDate: string;
    isMinBookingDateLoading: boolean = true;
    areTaskCategoriesAndAssigmentsLoading: boolean = false;
    maxBookingDate: string
    duration: number;
    durationType: DurationType = DurationType.HOURS;
    durationTemp: string;
    task: Object = null;
    taskCategory: {name: string, value: string} = null;
    taskCategories: Array<any> = [];
    taskAssigments: Array<any> = [];
    taskAssigment: Object = null;
    hideAssigment: boolean = true;

    constructor(private alertCtrl: AlertController, private actionSheetController: ActionSheetController, private pickerCtrl: PickerController, private modalCtrl: ModalController, private viewCtrl: ViewController, private myTimeService: MyTimeService, private bookingDeadlineService: BookingDeadlineService, private newBookingService: NewBookingService) {
        this.maxBookingDate = moment().toISOString();
        this.bookingDate = this.maxBookingDate;
        this.durationTemp = '0.25';
        this.duration = 0.25;
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    createWorkingStep() {
        if (this.task === null) {
            let alert = this.alertCtrl.create({
                title: 'No Task selected',
                subTitle: 'Select a Task please!',
                buttons: ['OK']
            });
            alert.present();
        } else if (this.taskCategory === null) {
            let alert = this.alertCtrl.create({
                title: 'No Category selected',
                subTitle: 'Select a Category please!',
                buttons: ['OK']
            });
            alert.present();
        } else {
            this.viewCtrl.dismiss();
        }
    }

    selectTask() {
        let modal = this.modalCtrl.create(TaskSelection, {task: this.task});
        modal.present();
        modal.onDidDismiss(data => {
            if (data !== null) {
                this.task = data;
                this.areTaskCategoriesAndAssigmentsLoading = true;
                this.newBookingService.getTaskCategoriesAndAssigments(data, this.bookingDate).subscribe(
                    data=> {
                        this.taskCategories = data[0];
                        this.taskAssigments = data[1];
                        this.areTaskCategoriesAndAssigmentsLoading = false;
                        this.hideAssigment = this.taskAssigments.length === 0;
                        if(!this.hideAssigment){
                           this.taskAssigment = this.taskAssigments.length !== 0? this.taskAssigments[0].value: null;
                        }
                    }, error => {
                        console.log(error);
                        this.areTaskCategoriesAndAssigmentsLoading = false;
                    });
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

    formatDuration(duration) {
        return this.durationType === DurationType.HOURS ? parseFloat(duration).toFixed(2) : duration;
    }

    selectedDurationSegment(value) {
        this.duration = this.durationType == DurationType.MINUTES ? value * 60 : value;
    }

    //value is always in hours but text is either in hours or minutes
    //TODO generate values just once at at the opening modal
    private generateDurationValues(durationType: DurationType) {
        let array = [];
        let count = durationType == DurationType.HOURS ? 0.25 : 1;
        const max = durationType == DurationType.HOURS ? 24 : 1415.4;
        let i = count;
        for (i; i < max; i += count) {
            array.push({text: durationType == DurationType.HOURS ? i.toFixed(2) : i, value: i.toFixed(2)});
        }
        return array;
    }

    ngOnInit() {
        this.bookingDeadlineService.getBookingDeadline().subscribe(
            data => {
                this.isMinBookingDateLoading = false;
                this.minBookingDate = data.date.toISOString();
            }, error=> {
                console.log(error);
            });
    }
}