import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {BookingsPage} from '../pages/bookings/bookings';
import {SummaryPage} from '../pages/summary/summary';
import {SettingsPage} from '../pages/settings/settings';
@Component({
    templateUrl: 'build/tabs/tabs.html'
})

export class TabsPage {
    myTimeRoot: any = BookingsPage;
    summaryRoot: any = SummaryPage;
    settingsRoot: any = SettingsPage;
    mySelectedIndex: number = 0;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}