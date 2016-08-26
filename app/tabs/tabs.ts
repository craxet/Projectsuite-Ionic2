import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';

import {MyTimePage} from '../pages/my-time/my-time';
import {SummaryPage} from '../pages/summary/summary';

@Component({
    templateUrl: 'build/tabs/tabs.html'
})

export class TabsPage {
    myTimeRoot: any = MyTimePage;
    summaryRoot: any = SummaryPage;
    mySelectedIndex: number = 0;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}