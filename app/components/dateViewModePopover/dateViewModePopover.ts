import {Component} from '@angular/core';
import {NavParams,Events,ViewController } from 'ionic-angular';

import {CalViewType} from '../../enums/enums';

@Component({
    templateUrl: 'build/components/dateViewModePopover/dateViewModePopover.html'
})
export class DateViewModePopover {
    calView:CalViewType;

    constructor(private params:NavParams,private viewCtrl:ViewController) {
        this.calView = params.get('calView');
    }

    onCalViewChanged() {
        this.viewCtrl.dismiss(this.calView);
    }
}
