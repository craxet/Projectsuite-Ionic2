import {Popover,NavController} from 'ionic-angular';
import {Component,ViewChild,OnInit,OnChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Moment} from 'moment';
import * as _ from 'lodash';
import * as moment from 'moment';

import {MyTimeService} from './myTime.service';
import {DateViewModePopover} from '../../components/dateViewModePopover/dateViewModePopover'

enum CalViewType{
    DAY, WEEK, MONTH
}

enum Direction{
    PREV = <any>'PREV', NEXT = <any>'NEXT'
}

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
    monthIndex:number = 0;
    selectedDate:{name:string, from: Moment, to: Moment};
    calView:CalViewType = CalViewType.MONTH;
    dates:Array<{name: string, from: Date, to: Date}> = [];
    workingSteps:Array<any> = [];
    inclBooked:boolean = false;
    tenant:string = null;
    memberId:string = null;

    constructor(private nav:NavController, private myTimeService:MyTimeService) {
        this.setNewDateRange();
    }

    setNewDateRange(direction?) {
        switch (this.calView) {
            case CalViewType.DAY:
                break;
            case CalViewType.MONTH:
                if (this.monthIndex < 3) {
                    let newDate:Moment = null;
                    if (Direction.PREV === direction) {
                        this.monthIndex++;
                        newDate = this.selectedDate.from.subtract(1, 'month');
                    } else if (Direction.NEXT === direction) {
                        this.monthIndex++;
                        newDate = this.selectedDate.from.add(1, 'month');
                    } else {
                        newDate = moment();
                    }
                    console.log(this.monthIndex);
                    this.selectedDate = {
                        name: newDate.format('MMMM'),
                        from: newDate.startOf('month'), to: newDate.endOf('month')
                    };
                    this.hideNextButton = this.selectedDate.from.month() === moment().month();
                    this.hidePrevButton = this.monthIndex >= 3;
                }
                this.monthIndex = this.monthIndex === 3 ? 0 : this.monthIndex;
            case CalViewType.MONTH:
                break;
        }
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
        //this.workingSteps = this.myTimeService.getWorkingSteps(this.selectedDate.from, this.selectedDate.to, this.inclBooked, this.memberId, this.tenant);
    }

    /* headerDateFn(record, recordIndex, records) {
     var datePipe = new DatePipe();
     //TODO use formatter in template
     return datePipe.transform(new Date(parseInt(record.date)), 'dd.MM.yyyy');
     }*/

    ngOnInit() {
        //this.getWorkingSteps();
    }
}