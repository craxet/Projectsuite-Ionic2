import {Component} from '@angular/core';
import {Modal, NavController,ViewController} from 'ionic-angular';
import * as moment from 'moment';

@Component({
    templateUrl: 'build/components/custom-dates-modal/custom-dates-modal.html'
})
export class CustomDatesModal {

    from:Date;
    to:Date;
    //todayISOFormat:String;

    constructor(private viewCtrl:ViewController) {
        /*  const currentDate = moment({hour: 0, minute: 0, seconds: 0, milliseconds: 0});
         this.todayISOFormat = currentDate.format('YYYY-MM-DD');
         this.from = currentDate.subtract(14, 'days').toDate();
         this.to = currentDate.toDate();*/

    }

    ok() {
        this.viewCtrl.dismiss({from: moment(this.from), to: moment(this.to)});
    }

    cancel() {
        this.viewCtrl.dismiss(null);
    }
}