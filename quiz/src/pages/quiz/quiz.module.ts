import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizPage } from './quiz';

@NgModule({
  declarations: [
    QuizPage,
  ],
  imports: [
    IonicPageModule.forChild(QuizPage),
  ],
  schemas: [ 
    CUSTOM_ELEMENTS_SCHEMA, 
  ]
})
export class QuizPageModule {}
