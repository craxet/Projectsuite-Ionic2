import {Component, OnInit} from '@angular/core';
import {
    ViewController,
    ModalController,
    PickerController,
    ActionSheetController,
    AlertController,
    LoadingController, NavParams
} from 'ionic-angular';
import * as moment from 'moment';
import * as _ from  'lodash';

import {MyTimeService} from '../my-time.service';
import {TaskSelection} from '../../../components/task-selection/task-selection';
import {TaskSelectionService} from '../../../components/task-selection/task-selection.service';
import {DurationTypePipe} from '../../../pipes/duration-type-pipe';
import {DurationPipe} from '../../../pipes/duration-pipe';
import {BookingDeadlineService} from '../../../services/booking-deadline.service';
import {WorkingStepService} from './working-step.service';

enum DurationType{
    HOURS = <any>'hours', MINUTES = <any>'minutes', NONE = <any>'none'
}

@Component({
    templateUrl: 'build/pages/my-time/working-step/working-step.html',
    providers: [MyTimeService, BookingDeadlineService, WorkingStepService, TaskSelectionService],
    pipes: [DurationTypePipe, DurationPipe]
})
export class WorkingStep implements OnInit {

    minBookingDate: string;
    isMinBookingDateLoading: boolean = true;
    isTaskSelectionLoading: boolean = false;
    areTaskCategoriesAndAssigmentsLoading: boolean = false;
    maxBookingDate: string
    durationType: DurationType = DurationType.HOURS;
    durationTemp: string;
    taskCategories: Array<any> = [];
    taskAssigments: Array<any> = [];
    hideAssigment: boolean = true;
    //TODO create modal
    // workingStep: {bookingDate: string,duration: number,task: Object,taskCategory: Object,taskAssigment: Object,activity: string};
    workingStep;
    labelButtonMode;
    private durationValuesHours: Array<any> = [];
    private durationValuesMinutes: Array<any> = [];

    constructor(private params: NavParams, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private actionSheetController: ActionSheetController, private pickerCtrl: PickerController, private modalCtrl: ModalController, private viewCtrl: ViewController, private myTimeService: MyTimeService, private bookingDeadlineService: BookingDeadlineService, private workingStepService: WorkingStepService, private taskSelectionService: TaskSelectionService) {
        this.maxBookingDate = moment().toISOString();
        this.durationTemp = '0.25';
        const ws = params.get('workingStep');
        if (ws) {
            this.labelButtonMode = 'Edit';
            this.workingStep = {};
            //edit working step - set attributes that do not need loading time
            this.workingStep.id = ws.id;
            this.workingStep.duration = ws.duration;
            this.workingStep.activity = ws.activity;
        } else {
            this.labelButtonMode = 'Create';
            //create new working step
            this.workingStep = {
                bookingDate: this.maxBookingDate,
                duration: 0.25,
                task: null,
                taskCategory: null,
                taskAssigment: null,
                activity: ''
            };
        }
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    createOrEditWorkingStep() {
        if (this.workingStep.task === null) {
            let alert = this.alertCtrl.create({
                title: 'No Task selected',
                subTitle: 'Select a Task please!',
                buttons: ['OK']
            });
            alert.present();
        } else if (this.workingStep.taskCategory === null) {
            let alert = this.alertCtrl.create({
                title: 'No Category selected',
                subTitle: 'Select a Category please!',
                buttons: ['OK']
            });
            alert.present();
        } else {
            //TODO pass taskCategory like object not like value because of json-server
            this.workingStep.taskCategory = _.find(this.taskCategories, ['value', this.workingStep.taskCategory]);
            if (this.params.get('workingStep')) {
                let loader = this.loadingCtrl.create({
                    content: 'Editing...'
                });
                loader.present();
                loader.onDidDismiss(data=> {
                    this.viewCtrl.dismiss(data);
                });
                this.myTimeService.editWorkingStep(this.workingStep).subscribe(
                    data=> {
                        loader.dismiss(data);
                    }, error=> {
                        console.log(error);
                    });
            } else {
                let loader = this.loadingCtrl.create({
                    content: 'Creating...'
                });
                loader.present();
                loader.onDidDismiss(data=> {
                    this.viewCtrl.dismiss(data);
                });
                this.myTimeService.createWorkingStep(this.workingStep).subscribe(data=> {
                    loader.dismiss(data);
                }, error=> {
                    console.log(error);
                });
            }
        }
    }


    selectTask() {
        let modal = this.modalCtrl.create(TaskSelection, {task: this.workingStep.task});
        modal.present();
        modal.onDidDismiss(data => {
            if (data !== null) {
                this.workingStep.task = data;
                this.areTaskCategoriesAndAssigmentsLoading = true;
                this.workingStepService.getTaskCategoriesAndAssigments(data, this.workingStep.bookingDate).subscribe(
                    data=> {
                        this.taskCategories = data[0];
                        this.taskAssigments = data[1];
                        this.areTaskCategoriesAndAssigmentsLoading = false;
                        this.hideAssigment = this.taskAssigments.length === 0;
                        if (!this.hideAssigment) {
                            this.workingStep.taskAssigment = this.taskAssigments.length !== 0 ? this.taskAssigments[0].value : null;
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
                this.workingStep.duration = data.duration.value;
                this.durationTemp = this.durationType == DurationType.MINUTES ? (data.duration.value / 60).toFixed(2) : data.duration.value.toString();
            }
        });
        picker.addColumn({
            name: 'duration',
            options: this.durationType == DurationType.HOURS ? this.durationValuesHours : this.durationValuesMinutes
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
                            this.workingStep.duration /= 60;
                            this.durationType = DurationType.HOURS
                        }
                    }
                }, {
                    text: 'Minutes',
                    handler: () => {
                        if (this.durationType == DurationType.HOURS) {
                            this.workingStep.duration *= 60;
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

    selectedDurationSegment(value) {
        this.workingStep.duration = this.durationType == DurationType.MINUTES ? value * 60 : value;
    }

    //value is always in hours but text is either in hours or minutes
    private generateDurationValues(durationType: DurationType) {
        let array = [];
        let count = durationType == DurationType.HOURS ? 0.25 : 1;
        const max = durationType == DurationType.HOURS ? 24 : 360;
        let i = count;
        for (i; i < max; i += count) {
            array.push({text: durationType == DurationType.HOURS ? i.toFixed(2) : i, value: i.toFixed(2)});
        }
        return array;
    }

    ngOnInit() {
        //generation of values for duration picker
        this.durationValuesMinutes = this.generateDurationValues(DurationType.MINUTES);
        this.durationValuesHours = this.generateDurationValues(DurationType.HOURS);

        const ws = this.params.get('workingStep');
        if (this.params.get('workingStep')) {
            //TODO taskId was renamed to task because of json-server
            this.isTaskSelectionLoading = true;
            this.taskSelectionService.findTaskById(ws.task).subscribe(
                data => {
                    //TODO handle situation when task is not found
                    this.workingStep.task = data;
                    this.isTaskSelectionLoading = false;
                }, error=> {
                    console.log(error);
                });
            this.areTaskCategoriesAndAssigmentsLoading = true;
            this.workingStepService.getTaskCategoriesAndAssigments(ws.task, ws.date).subscribe(
                data => {
                    this.taskCategories = data[0];
                    this.workingStep.taskCategory = ws.category.value;
                    this.taskAssigments = data[1];
                    this.hideAssigment = this.taskAssigments.length === 0;
                    if (!this.hideAssigment) {
                        this.workingStep.taskAssigment = this.taskAssigments.length !== 0 ? this.taskAssigments[0].value : null;
                    }
                    this.areTaskCategoriesAndAssigmentsLoading = false;
                }, error=> {
                    console.log(error);
                })
        }
        this.bookingDeadlineService.getBookingDeadline().subscribe(
            data => {
                this.isMinBookingDateLoading = false;
                this.minBookingDate = data.date.toISOString();
                if (this.params.get('workingStep')) {
                    this.workingStep.bookingDate = moment(ws.date).toISOString();
                }

            }, error=> {
                console.log(error);
            });
    }
}