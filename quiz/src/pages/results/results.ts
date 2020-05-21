import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {
  @ViewChild('slides') slides: any;
  results = this.navParams.data;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
  }

  getFirstResult() {
    let loading = this.loadingController.create({
      content: 'Cargando resultados...'
  });

  loading.present();

  setTimeout(() => {
      loading.dismiss();
      this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }, 2000); 

    
  }

  getSecondResult() {
    let loading = this.loadingController.create({
      content: 'Cargando resultados...'
  });

  loading.present();

  setTimeout(() => {
      loading.dismiss();
      this.slides.lockSwipes(false);
    this.slides.slideTo(2);
    this.slides.lockSwipes(true);
  }, 2000); 
    
  }

  goToStart(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

}
