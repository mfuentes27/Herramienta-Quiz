import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule }    from '@angular/http';
import { Data } from '../providers/data';
import { MyApp } from './app.component';
import { Device } from '@ionic-native/device';

// Angular Fire Module
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../pages/user.service';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { QuizPageModule } from '../pages/quiz/quiz.module';
import { ResultsPageModule } from '../pages/results/results.module';



// AngularFire Settings
export const firebaseConfig = {
    apiKey: "AIzaSyD8C4Y2u0d2dj8nOOTFv7QOlCT5ZWnyIvw",
    authDomain: "herramienta-pe.firebaseapp.com",
    databaseURL: "https://herramienta-pe.firebaseio.com",
    projectId: "herramienta-pe",
    storageBucket: "herramienta-pe.appspot.com",
    messagingSenderId: "1050184480375",
    appId: "1:1050184480375:web:13971a0c7d5f7812c07872",
};

@NgModule({
    declarations: [
        MyApp, 
    
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        QuizPageModule,
        ResultsPageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
       
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AngularFireAuth,
        Data,
        Device,
        AngularFirestore,
        UserService,
    ],
    schemas: [ 
        NO_ERRORS_SCHEMA 
      ]
})
export class AppModule {}
