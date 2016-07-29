import {Popover,NavController} from 'ionic-angular';
import {Component,ViewChild,OnInit,OnChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Moment} from 'moment';

//cordova plugin
import {DatePicker} from 'ionic-native';

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

    private newDate:Moment;
    private monthLevel:number;
    private weekLevel:number;
    private dayLevel:number;

    constructor(private nav:NavController, private myTimeService:MyTimeService) {
        this.monthLevel = 2;
        this.weekLevel = 3;
        //number od days until today
        this.dayLevel = moment().date() - 1;
    }

    setNewDateRange(direction?) {
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
                //TODO just with cordova
                /*DatePicker.show({
                 date: new Date(),
                 mode: 'date'
                 }).then(
                 date => console.log("Got date: ", date),
                 err => console.log("Error occurred while getting date:", err)
                 );*/
                break;
        }
        this.getWorkingSteps();
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
        console.log('called');
        this.workingSteps = this.myTimeService.getWorkingSteps(this.selectedDate.from, this.selectedDate.to, this.inclBooked, this.memberId, this.tenant);
    }

    /* headerDateFn(record, recordIndex, records) {
     var datePipe = new DatePipe();
     //TODO use formatter in template
     return datePipe.transform(new Date(parseInt(record.date)), 'dd.MM.yyyy');
     }*/

    ngOnInit() {
        this.setNewDateRange();
    }
}