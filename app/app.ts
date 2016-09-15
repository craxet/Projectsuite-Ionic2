import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './tabs/tabs'
import {HTTP_PROVIDERS} from '@angular/http';

import {LoginPage} from './pages/login/login';
import {UserData} from './providers/user-data/user-data';

@Component({
    templateUrl: 'build/app.html',
    providers: [UserData]

})
class MyApp {

    @ViewChild(Nav) nav: Nav;

    rootPage: any;

    constructor(private platform: Platform, private userData: UserData) {
        this.initializeApp();

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }

    ngAfterViewInit() {
        this.userData.hasLoggedIn().then(state => {
            if (state) {
                console.log('is it Here');
                this.nav.setRoot(TabsPage);
            } else {
                this.nav.setRoot(LoginPage);
            }
        });

    }

}

ionicBootstrap(MyApp, [HTTP_PROVIDERS]);
