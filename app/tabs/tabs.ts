import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {MyTimePage} from '../pages/my-time/my-time';
import {AbsencePage} from '../pages/absence/absence';
import {TimesheetPage} from '../pages/timesheet/timesheet';




@Component({
    templateUrl: 'build/tabs/tabs.html'
})

export class TabsPage {
    myTimeRoot: any = MyTimePage;
    absenceRoot: any = AbsencePage;
    timesheetRoot: any = TimesheetPage;
    mySelectedIndex: number = 0;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}