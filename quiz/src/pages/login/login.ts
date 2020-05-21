import { Component, Injectable, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { UserService } from '../user.service';
import { QuizPage } from '../quiz/quiz';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { take } from 'rxjs/operators';
import { firestore } from 'firebase';


@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',

})
@Injectable()
export class LoginPage {
    @ViewChild('myNav') nav: NavController


    db = firebase.firestore();
    index;
    user_index;
   

    constructor(
        public loadingController: LoadingController,
        public alertController: AlertController,
        public navCtrl: NavController,
        public userServ: UserService,
        public afstore: AngularFirestore,
    ) {
       
    }

    getUsers(user: string) {
       let users = [];

        this.db.collection("Usuarios").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (user == (`${doc.data().Matricula}`)) {
                    this.userServ.setUser({
                        user,
                        uid: doc.id
                    })
                this.user_index = doc.id;
                }
                
                users.push(`${doc.data().Matricula}`);
            });

            var registration = users.find(function (element) {
                return element == user;
            });

            this.index = users.indexOf(user);
            if (registration == user) {
                this.readFirebaseData(user);
            }

            


            let loading = this.loadingController.create({
                content: 'Autenticando información...'
            });
    

            loading.present();
    
            setTimeout(() => {
                if (registration == user) {
                    this.navCtrl.push(QuizPage, this.index);
                } else {
                    this.presentAlert();
                }
            }, 2000);
    
            setTimeout(() => {
                loading.dismiss();
            }, 2000); 
           
        });
    }

    async presentAlert() {
        const alert = await this.alertController.create({
            title: 'Error',
            message: 'No pertenece al curso',
            buttons: ['OK']
        });
        await alert.present();
    }

    readFirebaseData(user) {
        console.log(user);
        
        this.readUsingObservable().subscribe(data => {
            console.log(data[this.index].Resultados);
            if (data[this.index].Resultados == undefined ){
                console.log("doc not exists");
                this.afstore.doc(`Usuarios/${this.user_index}`).update({
                    Resultados: firestore.FieldValue.arrayRemove({
                        
                    })
                });
            } else {
                console.log("doc exists");
            }
            
        });
    }

    readUsingObservable(): Observable<any> {
        return this.afstore.collection('Usuarios').valueChanges().pipe(take(1));
    }

}