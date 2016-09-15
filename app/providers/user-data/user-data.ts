import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Storage, SqlStorage, Events} from 'ionic-angular';
import 'rxjs/Rx';

@Injectable()
export class UserData {

    HAS_LOGGED_IN = 'hasLoggedIn';
    storage: Storage;

    constructor(private http: Http, private events: Events) {
        this.storage = new Storage(SqlStorage);
    }

    login(credentials) {
        return this.http.get('/api/login').map(res => {
            const storedCred = res.json();
            const hasLoggedIn = storedCred.username == credentials.username && storedCred.password == credentials.password;
            this.storage.set(this.HAS_LOGGED_IN, hasLoggedIn);
            return hasLoggedIn;
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        });
        // this.events.publish('user:login');
    }

    logout() {
        return this.storage.set(this.HAS_LOGGED_IN, false);
        // this.events.publish('user:logout');
    }

    hasLoggedIn() {
        return this.storage.get(this.HAS_LOGGED_IN).then(value => {
            //You have to parse value of storage anyway you get string value not boolean value
            return JSON.parse(value);
        });
    }
}

