import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Moment} from 'moment';

import {CalendarView} from '../../components/calendar-view/calendar-view';

@Component({
    templateUrl: 'build/pages/summary/summary.html',
    directives:[CalendarView]
})

export class SummaryPage{

    selectedDate: {from: Moment, to:Moment};

    constructor(private nav: NavController) {}

    callGetSummaryEntries(selectedDate){
        this.selectedDate = selectedDate;
        this.getSummaryEntries();
    }

    getSummaryEntries(){

    }
}