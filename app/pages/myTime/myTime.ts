import {Popover,NavController} from 'ionic-angular';
import {Component,ViewChild,OnInit,OnChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import * as _ from 'lodash';
import * as moment from 'moment';
//const momentCons: (value?: any) => moment.Moment = (<any>moment).default || moment;

import {MyTimeService} from './myTime.service';
import {DateViewModePopover} from '../../components/dateViewModePopover/dateViewModePopover'

@Component({
    templateUrl: 'build/pages/myTime/myTime.html',
    styles: [
        `.month-or-week span{
            color: #8c8c8c;
        }
        .active{
            color: #387ef5;
        }
        `
    ],
    providers: [MyTimeService]
})

export class MyTimePage implements OnInit {

    hidePrevButton:boolean;
    hideNextButton:boolean;
    selectedDate:{name:string,from: Date, to: Date};
    calendarViewType:string = 'month';
    monthsShort:Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    dates:Array<{name: string, from: Date, to: Date}> = [];
    workingSteps:Array<any> = [];
    inclBooked:boolean = false;
    tenant:string = null;
    memberId:string = null;

    constructor(private nav:NavController, private myTimeService:MyTimeService) {
        console.log(moment());
        const today = new Date();
        if (this.calendarViewType === 'month') {
            const m = today.getMonth();
            const y = today.getFullYear();
            this.selectedDate = {
                name: this.monthsShort[m],
                from: new Date(y, m, 1),
                to: new Date(y, m + 1, 0)
            };
            this.dates.push(this.selectedDate);
            this.dates.push({
                name: this.monthsShort[m - 1],
                from: new Date(y, m - 1, 1),
                to: new Date(y, m + 1 - 1, 0)
            });
            this.dates.push({
                name: this.monthsShort[m - 2],
                from: new Date(y, m - 2, 1),
                to: new Date(y, m + 1 - 2, 0)
            });
            this.hideNextButton = true;
        }
    }

    changeDate(direction) {
        if (direction === 'prev') {
            if (this.calendarViewType === 'month') {
                const prevDateIdx = this.dates.indexOf(this.selectedDate) + 1;
                if (prevDateIdx < this.dates.length) {
                    this.selectedDate = this.dates[prevDateIdx];
                    this.getWorkingSteps();
                }

                if (this.selectedDate === this.dates[2]) {
                    this.hidePrevButton = true;
                    this.hideNextButton = false;
                } else {
                    this.hidePrevButton = this.hideNextButton = false;
                }
            }
        } else if (direction === 'next') {
            if (this.calendarViewType === 'month') {
                const nextDateIdx = this.dates.indexOf(this.selectedDate) - 1;
                if (nextDateIdx >= 0) {
                    this.selectedDate = this.dates[nextDateIdx];
                    this.getWorkingSteps();
                }
                if (this.selectedDate === this.dates[0]) {
                    this.hideNextButton = true;
                    this.hidePrevButton = false;
                } else {
                    this.hideNextButton = this.hidePrevButton = false;
                }
            }
        }
    }

    setCalendarViewType(type) {
        this.calendarViewType = type;
    }

    createBooking() {

    }

    showDateViewModePopover(ev) {
        let popover = Popover.create(DateViewModePopover);
        this.nav.present(popover, {
            ev: ev
        });
    }

    getWorkingSteps() {
        this.workingSteps = this.myTimeService.getWorkingSteps(this.selectedDate.from, this.selectedDate.to, this.inclBooked, this.memberId, this.tenant);
    }

    /* headerDateFn(record, recordIndex, records) {
     var datePipe = new DatePipe();
     //TODO use formatter in template
     return datePipe.transform(new Date(parseInt(record.date)), 'dd.MM.yyyy');
     }*/

    ngOnInit() {
        this.getWorkingSteps();
    }
}