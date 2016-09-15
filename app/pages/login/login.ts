import {Component, trigger, state, style, transition, animate, keyframes} from '@angular/core';
import {NavController,LoadingController} from 'ionic-angular';

import {Credentials} from '../../models/credentials';
import {TabsPage} from '../../tabs/tabs';
import {UserData} from '../../providers/user-data/user-data';

@Component({
    templateUrl: 'build/pages/login/login.html',
    providers: [UserData],
    animations: [

        //For the logo
        trigger('flyInBottomSlow', [
            state('in', style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('void => *', [
                style({transform: 'translate3d(0,2000px,0'}),
                animate('2000ms ease-in-out')
            ])
        ]),

        //For the login form
        trigger('bounceInBottom', [
            state('in', style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('void => *', [
                animate('2000ms 200ms ease-in', keyframes([
                    style({transform: 'translate3d(0,2000px,0)', offset: 0}),
                    style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
                    style({transform: 'translate3d(0,0,0)', offset: 1})
                ]))
            ])
        ]),

        //For login button
        trigger('fadeIn', [
            state('in', style({
                opacity: 1
            })),
            transition('void => *', [
                style({opacity: 0}),
                animate('1000ms 2000ms ease-in')
            ])
        ])
    ]
})
export class LoginPage {

    credentials: Credentials = new Credentials();
    badCredentials = false;
    inputTypePassword = "password";

    constructor(private navCtrl: NavController, private userData: UserData,private loadingController:LoadingController) {
    }

    onLogin(form) {
        this.userData.login(this.credentials).subscribe(
            data => {
                if (data) {
                    this.badCredentials = false;
                    this.navCtrl.push(TabsPage);
                } else {
                    this.badCredentials = true;
                }
            }, error => {
                console.log(error);
            });
    }

    changeInputPassType(){
        if(this.inputTypePassword == 'password'){
            this.inputTypePassword = 'text';
        }else{
            this.inputTypePassword = 'password';
        }
    }


}
