import {Component} from '@angular/core';
import {LoadingController, Nav} from 'ionic-angular';

import {UserData} from '../../providers/user-data/user-data';
import {LoginPage} from '../login/login';

@Component({
    templateUrl: 'build/pages/settings/settings.html',
    providers: [UserData]
})
export class SettingsPage {

    constructor(private nav: Nav, private userData: UserData, private loadingCtrl: LoadingController) {

    }

    onLogout() {
        this.userData.logout().then(()=> {
            this.nav.setRoot(LoginPage,{},{animate: true,direction: 'back'});
        });
    }

}
