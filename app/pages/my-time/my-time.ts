import {LoadingController, PopoverController, ModalController, AlertController, Refresher} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Moment} from 'moment';

import * as _ from 'lodash';
import * as moment from 'moment';
import {DateFormatPipe} from 'angular2-moment';
import {DurationPipe} from '../../pipes/duration-pipe.ts';

import {MyTimeService} from './my-time.service';
import {DateViewModePopover} from '../../components/date-view-mode-popover/date-view-mode-popover';
import {CalViewType} from '../../enums/enums';
import {CustomDatesModal} from '../../components/custom-dates-modal/custom-dates-modal';
import {NewBooking} from './new-booking/new-booking';
import {WorkingStepMoreModal} from '../../components/working-step-more/working-step-more-modal';

enum Direction{
    PREV = <any>'PREV', NEXT = <any>'NEXT'
}

@Component({
    templateUrl: 'build/pages/my-time/my-time.html',
    styles: [
        `.month-or-week span{
            color: #8c8c8c;
        }
        .active{
            color: #387ef5;
        }

        `
    ],
    providers: [MyTimeService],
    pipes: [DateFormatPipe, DurationPipe]
})

export class MyTimePage implements OnInit {

    hidePrevButton: boolean;
    hideNextButton: boolean;
    dateIndex: number = 0;
    selectedDate: {name: string, from: Moment, to: Moment};
    calView: CalViewType = CalViewType.MONTH;
    lastCalView: CalViewType = CalViewType.MONTH;
    workingSteps: Array<any> = [];
    totalSumOfWorkingSteps: number;
    firstLastDateOfWorkingSteps: {first: Moment, last: Moment};
    inclBooked: boolean = false;
    tenant: string = null;
    memberId: string = null;
    selectedDateClass: boolean = false;
    areWorkingStepsLoading: boolean = false;

    private newDate: Moment;
    private monthLevel: number;
    private weekLevel: number;
    private dayLevel: number;

    constructor(private loadingController: LoadingController, private alertController: AlertController, private modalCtrl: ModalController, private popoverCtrl: PopoverController, private myTimeService: MyTimeService) {
        this.monthLevel = 2;
        this.weekLevel = 3;
        //number od days until today
        this.dayLevel = moment().date() - 1;
    }

    setNewDateRange(direction?) {
        this.selectedDateClass = false;
        switch (this.calView) {
            case CalViewType.DAY:
                if (Direction.PREV === direction) {
                    this.dateIndex++;
                    this.newDate = this.selectedDate.from.add(-1, 'day');
                } else if (Direction.NEXT === direction) {
                    this.dateIndex--;
                    this.newDate = this.selectedDate.from.add(1, 'day');
                } else {
                    this.newDate = moment({hour: 0, minute: 0, seconds: 0, milliseconds: 0});
                }
                this.selectedDate = {
                    name: this.newDate.format('ddd, DD.MM.YYYY'),
                    from: this.newDate.clone().startOf('day'), to: this.newDate.clone().endOf('day')
                };
                this.hideNextButton = this.selectedDate.from.isSame(moment({
                    hour: 0,
                    minute: 0,
                    seconds: 0,
                    milliseconds: 0
                }));
                this.hidePrevButton = this.dateIndex === this.dayLevel && !this.hideNextButton;
                break;
            case CalViewType.MONTH:
                if (Direction.PREV === direction) {
                    this.dateIndex++;
                    this.newDate = this.selectedDate.from.add(-1, 'month');
                } else if (Direction.NEXT === direction) {
                    this.dateIndex--;
                    this.newDate = this.selectedDate.from.add(1, 'month');
                } else {
                    this.newDate = moment({hour: 0, minute: 0, seconds: 0, milliseconds: 0});
                }
                this.selectedDate = {
                    name: this.newDate.format('MMMM'),
                    from: this.newDate.clone().startOf('month'), to: this.newDate.clone().endOf('month')
                };
                this.hideNextButton = this.selectedDate.from.month() === moment().month();
                this.hidePrevButton = this.dateIndex === this.monthLevel && !this.hideNextButton;
                break;
            case CalViewType.WEEK:
                this.selectedDateClass = true;
                if (Direction.PREV === direction) {
                    this.dateIndex++;
                    this.newDate = this.selectedDate.from.add(-1, 'week');
                } else if (Direction.NEXT === direction) {
                    this.dateIndex--;
                    this.newDate = this.selectedDate.from.add(1, 'week');
                } else {
                    this.newDate = moment({hour: 0, minute: 0, seconds: 0, milliseconds: 0});
                }
                const startOfWeek = this.newDate.clone().startOf('isoWeek');
                const endOfWeek = this.newDate.clone().endOf('isoWeek');
                const name = startOfWeek.format('DD.MM.YYYY') + ' - ' + endOfWeek.format('DD.MM.YYYY') + ' ' + this.newDate.format('(W.)');
                this.selectedDate = {
                    name: name,
                    from: startOfWeek, to: endOfWeek
                };
                this.hideNextButton = this.selectedDate.from.week() === moment().week();
                this.hidePrevButton = this.dateIndex === this.weekLevel && !this.hideNextButton;
                break;
            case CalViewType.CUSTOM:
                if (this.lastCalView === CalViewType.WEEK) {
                    this.selectedDateClass = true;
                } else {
                    this.selectedDateClass = false;
                }
                let modal = this.modalCtrl.create(CustomDatesModal, {}, {enableBackdropDismiss: false});
                modal.present();
                modal.onDidDismiss(data => {
                    if (data !== null) {
                        this.selectedDateClass = true;
                        this.hidePrevButton = true;
                        this.hideNextButton = true;
                        this.selectedDate = {
                            name: data.from.format('DD.MM.YYYY') + ' - ' + data.to.format('DD.MM.YYYY'),
                            from: data.from,
                            to: data.to
                        };
                    } else {
                        this.calView = this.lastCalView;
                        if (this.calView === CalViewType.WEEK) {
                            this.selectedDateClass = true;
                        } else {
                            this.selectedDateClass = false;
                        }

                    }
                });
                break;
        }
        //TODO cancel request if prev or next button will be quickly selected
        this.getWorkingSteps();
    }

    createBooking() {
        let modal = this.modalCtrl.create(NewBooking);
        modal.present();
    }

    openMoreModal() {
        let modal = this.modalCtrl.create(WorkingStepMoreModal, {
            inclBooked: this.inclBooked,
            selectedDate: this.selectedDate,
            totalSumOfWorkingSteps: this.totalSumOfWorkingSteps,
            firstLastDateOfWorkingSteps: this.firstLastDateOfWorkingSteps
        });
        modal.present();
        modal.onDidDismiss(data => {
            if (data && this.inclBooked !== data.inclBooked) {
                this.inclBooked = data.inclBooked;
                this.getWorkingSteps();
            }
        });
    }

    showDateViewModePopover(ev) {
        this.lastCalView = this.calView;
        let popover = this.popoverCtrl.create(DateViewModePopover, {calView: this.calView});
        popover.onDidDismiss(data=> {
            this.dateIndex = 0;
            this.calView = data;
            this.setNewDateRange();
        });
        popover.present({ev: ev});
    }

    getWorkingSteps(refresher: Refresher = null) {
        this.areWorkingStepsLoading = refresher === null ? true : false;
        this.myTimeService.getWorkingSteps(this.selectedDate.from, this.selectedDate.to, this.inclBooked, this.memberId, this.tenant).subscribe(
            data => {
                this.workingSteps = data.list;
                this.totalSumOfWorkingSteps = data.totalSum;
                this.firstLastDateOfWorkingSteps = data.firstLast;
                this.areWorkingStepsLoading = false;
                refresher && refresher.complete();
            },
            error => {
                console.log(error);
                this.areWorkingStepsLoading = false;
                refresher && refresher.complete();
            }
        );
    }

    deleteWorkingStep(workingStep) {
        let loader = this.loadingController.create();
        let prompt = this.alertController.create({
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
                            this.deleteWorkingStepLocally(workingStep);
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

    deleteWorkingStepLocally(workingStep) {
        this.workingSteps.forEach((item, index, array)=> {
            if (item.date === workingStep.date) {
                item.values.splice(item.values.findIndex((el)=> {
                    return el.id === workingStep.id;
                }), 1);
                if (item.values.length === 0) {
                    array.splice(index, 1);
                }
            }
        });
    }

    editWorkingStep() {

    }

    ngOnInit() {
        this.setNewDateRange();
    }
}