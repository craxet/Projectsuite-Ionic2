import {Popover,NavController} from 'ionic-angular';
import {Component,ViewChild,OnInit,OnChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Moment} from 'moment';
import * as _ from 'lodash';
import * as moment from 'moment';

import {MyTimeService} from './myTime.service';
import {DateViewModePopover} from '../../components/dateViewModePopover/dateViewModePopover';
import {CalViewType} from '../../enums/enums';

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
    dateIndex:number = 0;
    selectedDate:{name:string, from: Moment, to: Moment};
    calView:CalViewType = CalViewType.MONTH;
    workingSteps:Array<any> = [];
    inclBooked:boolean = false;
    tenant:string = null;
    memberId:string = null;

    selectedDateClass:boolean = false;

    private monthLevel:number = 2;
    private weekLevel:number = 3;

    constructor(private nav:NavController, private myTimeService:MyTimeService) {
        this.setNewDateRange();
    }

    setNewDateRange(direction?) {
        switch (this.calView) {
            case CalViewType.DAY:
                break;
            case CalViewType.MONTH:
                if (this.dateIndex < this.monthLevel) {
                    let newDate:Moment = null;
                    if (Direction.PREV === direction) {
                        this.dateIndex++;
                        newDate = this.selectedDate.from.subtract(1, 'month');
                    } else if (Direction.NEXT === direction) {
                        this.dateIndex++;
                        newDate = this.selectedDate.from.add(1, 'month');
                    } else {
                        newDate = moment();
                    }
                    this.selectedDate = {
                        name: newDate.format('MMMM'),
                        from: newDate.clone().startOf('month'), to: newDate.clone().endOf('month')
                    };
                }
                this.hideNextButton = this.selectedDate.from.month() === moment().month();
                this.hidePrevButton = this.dateIndex === this.monthLevel && !this.hideNextButton;
                this.dateIndex = this.dateIndex === this.monthLevel ? 0 : this.dateIndex;
                break;
            case CalViewType.WEEK:
                this.selectedDateClass = true;
                if (this.dateIndex < this.weekLevel) {
                    let newDate:Moment = null;
                    if (Direction.PREV === direction) {
                        this.dateIndex++;
                        newDate = this.selectedDate.from.subtract(1, 'week');
                    } else if (Direction.NEXT === direction) {
                        this.dateIndex++;
                        newDate = this.selectedDate.from.add(1, 'week');
                    } else {
                        newDate = moment({hour: 0, minute: 0, seconds: 0, milliseconds: 0});
                    }
                    const startOfWeek = newDate.clone().startOf('isoWeek');
                    const endOfWeek = newDate.clone().endOf('isoWeek');
                    const name = startOfWeek.format('DD.MM.YYYY') + ' - ' + endOfWeek.format('DD.MM.YYYY') + ' ' + newDate.format('(W.)');
                    this.selectedDate = {
                        name: name,
                        from: startOfWeek, to: endOfWeek
                    };
                }
                this.hideNextButton = this.selectedDate.from.week() === moment().week();
                this.hidePrevButton = this.dateIndex === this.weekLevel && !this.hideNextButton;
                this.dateIndex = this.dateIndex === this.weekLevel ? 0 : this.dateIndex;
                break;
        }
    }

    createBooking() {

    }

    showDateViewModePopover(ev) {
        let popover = Popover.create(DateViewModePopover, {calView: this.calView});
        popover.onDismiss(data=> {
            this.dateIndex = 0;
            this.calView = data;
            this.setNewDateRange();
        });
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