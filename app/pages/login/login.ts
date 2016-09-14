import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {Credentials} from '../../models/credentials';

@Component({
    templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {

    credentials: Credentials = new Credentials();

    constructor(private navCtrl: NavController) {}

    onLogin(form) {
        console.log(form);
    }

}
