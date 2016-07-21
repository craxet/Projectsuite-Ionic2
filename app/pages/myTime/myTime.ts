import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Slides} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';

import {MyTimeService} from './myTime.service';



@Component({
    templateUrl: 'build/pages/myTime/myTime.html',
    styles: [
        `.month-or-week span{
            color: #8c8c8c;
        }
        .active{
            color: #387ef5;
        }`
    ],
    providers:[MyTimeService]
})

export class MyTimePage implements OnInit{

    @ViewChild('mySlider') slider:Slides;

    slidedDate:any;
    calendarViewType:string = 'month';
    monthsShort:Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    dates:Array<{name: string, from: Date, to: Date}> = [];
    workingSteps:Array<any> = [];
    inclBooked:boolean = false;
    tenant:string = null;
    memberId:string = null;

    constructor(private nav:NavController,private myTimeService: MyTimeService) {
        const today = new Date();
        if (this.calendarViewType === 'month') {
            const m = today.getMonth();
            const y = today.getFullYear();
            this.slidedDate = {
                name: this.monthsShort[m],
                from: new Date(y, m, 1),
                to: new Date(y, m + 1, 0)
            };
            this.dates.push(this.slidedDate);
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
        }
    }

    onSlideChanged() {
        let currentIndex = this.slider.getActiveIndex();
        this.slidedDate = this.dates[currentIndex];
        this.getWorkingSteps();
    }

    setCalendarViewType(type) {
        this.calendarViewType = type;
    }

    createBooking() {

    }

    getWorkingSteps(){
        this.workingSteps = this.myTimeService.getWorkingSteps(this.slidedDate.from,this.slidedDate.to,this.inclBooked,this.memberId,this.tenant);
        console.log(this.workingSteps);
    }

    headerDateFn(record, recordIndex, records){
        var datePipe = new DatePipe();
        //TODO use formatter in template
        return datePipe.transform(new Date(parseInt(record.date)), 'dd.MM.yyyy');
    }

    ngOnInit() {
        this.getWorkingSteps();
    }

}