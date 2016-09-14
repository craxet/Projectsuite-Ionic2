import { Injectable } from '@angular/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';

@Injectable()
export class UserData {

  HAS_LOGGED_IN = 'hasLoggedIn';
  storage = new Storage(LocalStorage);

  constructor(private events: Events) {}

  login(username){
    this.events.publish('user:login');
  }

  logout(){
    this.events.publish('user:logout');
  }

  hasLoggedIn(){
    return false;
  }
}

