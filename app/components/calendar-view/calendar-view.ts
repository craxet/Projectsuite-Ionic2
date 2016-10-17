import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ModalController, PopoverController, IONIC_DIRECTIVES} from 'ionic-angular';
import * as moment from 'moment';
import {Moment} from 'moment';

import {CalViewType, Direction} from '../../enums/enums';
import {CustomDatesModal} from '../custom-dates-modal/custom-dates-modal';
import {DateViewModePopover} from '../date-view-mode-popover/date-view-mode-popover';

@Component({
    selector: 'calendar-view',
    templateUrl: 'build/components/calendar-view/calendar-view.html',
    directives: [IONIC_DIRECTIVES]
})
export class CalendarView implements OnInit {

    @Output()
    onListUpdate = new EventEmitter<Object>();

    hidePrevButton: boolean;
    hideNextButton: boolean;
    dateIndex: number = 0;
    selectedDate: {name: string, from: Moment, to: Moment};
    calView: CalViewType = CalViewType.MONTH;
    lastCalView: CalViewType = CalViewType.MONTH;
    selectedDateClass: boolean = false;

    private newDate: Moment;
    private monthLevel: number;
    private weekLevel: number;
    private dayLevel: number;

    constructor(private modalCtrl: ModalController, private popoverCtrl: PopoverController) {
        this.monthLevel = 5;
        this.weekLevel = 3;
        //number od days until today
        this.dayLevel = moment().date() - 1;
    }

    setNewDateRange(direction?) {
        this.selectedDateClass = false;
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
                this.selectedDateClass = true;
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
                if (this.lastCalView === CalViewType.WEEK) {
                    this.selectedDateClass = true;
                } else {
                    this.selectedDateClass = false;
                }
                let modal = this.modalCtrl.create(CustomDatesModal, {}, {enableBackdropDismiss: false});
                modal.present();
                modal.onDidDismiss(data => {
                    if (data !== null) {
                        this.selectedDateClass = true;
                        this.hidePrevButton = true;
                        this.hideNextButton = true;
                        this.selectedDate = {
                            name: data.from.format('DD.MM.YYYY') + ' - ' + data.to.format('DD.MM.YYYY'),
                            from: data.from,
                            to: data.to
                        };
                    } else {
                        this.calView = this.lastCalView;
                        if (this.calView === CalViewType.WEEK) {
                            this.selectedDateClass = true;
                        } else {
                            this.selectedDateClass = false;
                        }

                    }
                });
                break;
        }
        //TODO cancel request if prev or next button will be quickly selected
        this.onListUpdate.emit(this.selectedDate);
    }

    showDateViewModePopover(ev) {
        this.lastCalView = this.calView;
        let popover = this.popoverCtrl.create(DateViewModePopover, {calView: this.calView});
        popover.onDidDismiss(data=> {
            if(data == null){
                this.calView = this.lastCalView;
            }
            if (this.lastCalView != data && data != null) {
                this.dateIndex = 0;
                this.calView = data;
                this.setNewDateRange();
            }
        });
        popover.present({ev: ev});
    }

    ngOnInit() {
        this.setNewDateRange();
    }
}