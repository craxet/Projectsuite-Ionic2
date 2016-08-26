import {Component} from '@angular/core';
import {ionicBootstrap, Platform, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './tabs/tabs'
import { HTTP_PROVIDERS } from '@angular/http';

@Component({
    templateUrl: 'build/app.html'
})
class MyApp {
    rootPage:any = TabsPage;

    constructor(private platform:Platform) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }

}

ionicBootstrap(MyApp, [HTTP_PROVIDERS]);
