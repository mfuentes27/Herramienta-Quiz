import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { Platform } from 'ionic-angular';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any

    constructor(private afAuth: AngularFireAuth, public platform: Platform) {
        this.afAuth.authState.subscribe(user => {
              if (!user) {
                  this.rootPage = 'LoginPage';
              } else {
                  this.rootPage = 'HomePage'
              }
          })           
    }


}

