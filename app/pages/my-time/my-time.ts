import {
    LoadingController, ModalController, AlertController, Refresher, NavController, Content
} from 'ionic-angular';
import {
    ViewChild,
    Component, trigger,
    state,
    style,
    animate,
    transition
} from '@angular/core';
import {Moment} from 'moment';

import {DateFormatPipe} from 'angular2-moment';
import {DurationPipe} from '../../pipes/duration-pipe';
import {OrderByPipe} from '../../pipes/order-by-pipe';

import {MyTimeService} from './my-time.service';
import {WorkingStep} from './working-step/working-step';
import {BookingMore} from '../../components/booking-more/booking-more';
import {BookingDetail} from './booking-detail/booking-detail';

import {CalendarView} from '../../components/calendar-view/calendar-view';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: 'build/pages/my-time/my-time.html',
    providers: [MyTimeService],
    pipes: [DateFormatPipe, DurationPipe, OrderByPipe],
    directives: [CalendarView],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            state('none', style({})),
            transition('void => in', [
                style({transform: 'translateX(-100%)'}),
                animate("400ms ease-in-out")
            ]),
            transition('in => void', [
                animate("400ms ease-in-out", style({transform: 'translateX(100%)'}))
            ])
        ])
    ]
})

export class MyTimePage {

    @ViewChild(Content) content: Content;

    selectedDate: {from: Moment, to: Moment};
    workingSteps: Array<any> = [];
    totalSumOfWorkingSteps: number;
    firstLastDateOfWorkingSteps: {first: Moment, last: Moment};
    inclBooked: boolean = false;
    tenant: string = null;
    memberId: string = null;
    areWorkingStepsLoading: boolean = false;
    newWorkingStepId = null;

    constructor(private nav: NavController, private loadingController: LoadingController, private alertController: AlertController, private modalCtrl: ModalController, private myTimeService: MyTimeService) {
        //TODO https://forum.ionicframework.com/t/ionic-2-get-scroll-position/56711/11
        //console.log(this.content.getScrollTop());
    }

    gotToWorkingStepDetail(step) {
        this.nav.push(BookingDetail, step);
    }

    createBooking() {
        let modal = this.modalCtrl.create(WorkingStep);
        modal.onDidDismiss((data)=> {
            if (data) {
                this.newWorkingStepId = data.id;
                const recomputed = this.myTimeService.addWorkingStepToList(data, this.workingSteps);
                this.workingSteps = recomputed.list;
                this.totalSumOfWorkingSteps = recomputed.totalSum;
                this.firstLastDateOfWorkingSteps = recomputed.firstLast;
                this.newWorkingStepId = null;
                console.log(this.content.getContentDimensions());
            }
        });
        modal.present();
    }

    openMoreModal() {
        let modal = this.modalCtrl.create(BookingMore, {
            inclBooked: this.inclBooked,
            selectedDate: this.selectedDate,
            totalSumOfBookings: this.totalSumOfWorkingSteps,
            firstLastDateOfBookings: this.firstLastDateOfWorkingSteps,
            bookingsLabel: 'Working Steps'
        });
        modal.present();
        modal.onDidDismiss(data => {
            if (data && this.inclBooked !== data.inclBooked) {
                this.inclBooked = data.inclBooked;
                this.getWorkingSteps();
            }
        });
    }

    callGetWorkingSteps(selectedDate) {
        this.selectedDate = selectedDate;
        this.getWorkingSteps();
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
        let loader = this.loadingController.create({
            content: 'Deleting...'
        });
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
                            this.myTimeService.deleteWorkingStepFromList(workingStep, this.workingSteps);
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
                this.getWorkingSteps();
            }
        });
        modal.present();
    }
}