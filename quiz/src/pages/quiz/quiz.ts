import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { Data } from '../../providers/data';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import 'rxjs/add/operator/map'
import { UserService } from '../user.service';
import { firestore } from 'firebase';
import { take } from 'rxjs/operators';
import { ResultsPage } from '../results/results';
import { Platform } from 'ionic-angular';


const circleR = 80;
const circleDasharray = 2 * Math.PI * circleR;

@IonicPage()
@Component({
    selector: 'page-quiz',
    templateUrl: 'quiz.html'
})
export class QuizPage {
    @ViewChild('slides') slides: any;


    time: BehaviorSubject<string> = new BehaviorSubject('00:00');
    percent: BehaviorSubject<number> = new BehaviorSubject(100);
    timer: number;
    circleR = circleR;
    circleDasharray = circleDasharray;
    hasAnswered: boolean = false;
    score: number = 0;
    myFuncCalls: number = 0;
    resultCall: number = 0;
    globalTime: number = 3600;
    index: number = 0;
    questions: any;
    results: any[] = [{}];
    question_text: any[] = [];
    answerArray: any[] = ["Sin selección", "Sin selección", "Sin selección", "Sin selección", "Sin selección", "Sin selección", "Sin selección", "Sin selección", "Sin selección", "Sin selección"];
    correctAnswer: any[] = [];
    first_results: any[] = [{}];
    second_results: any[] = [{}];
    showPreviousArrow: boolean;
    showNextArrow: boolean;
    showEasyLevel: boolean;
    showMediumLevel: boolean;
    showHardLevel: boolean;
    showResults: boolean;
    showCorrectIcon: boolean;
    showIncorrectIcon: boolean;
    opportunities_left: boolean;
    opportunity;

    index_user = this.navParams.data;

    constructor(public navCtrl: NavController, public dataService: Data,
        public loadingController: LoadingController, public alertController: AlertController,
        public afstore: AngularFirestore, public platform: Platform, public user: UserService, public navParams: NavParams) {

    }

    readFirebaseData() {
        this.readUsingObservable().subscribe(data => {
            let results_data = data[this.index_user].Resultados;
            this.first_results = data[this.index_user].Resultados[0];
            this.second_results = data[this.index_user].Resultados[1];
            if ((results_data.length) >= 2) {
                this.opportunities_left = false;
            } else if ((results_data.length) == 0) {
                this.opportunity = 1;
                this.opportunities_left = true;
            } else {
                this.opportunity = 2;
                this.opportunities_left = true;
            }
        });
    }

    readUsingObservable(): Observable<any> {
        return this.afstore.collection('Usuarios').valueChanges().pipe(take(1));
    }

    checkOpportunities() {
        if (this.opportunities_left == true) {
            this.startTimer();
        } else {
            this.presentAlert();
        }
    }

    async presentAlert() {
        const alert = await this.alertController.create({
            title: 'Error',
            message: 'Sin oportunidades',
            buttons: [{
                text: 'Ver resultados',
                handler: () => { this.navCtrl.push(ResultsPage, { first_results: this.first_results, second_results: this.second_results }); }
            }]
        });
        await alert.present();
    }

    ngAfterViewInit() {
        this.slides.lockSwipes(true);
        this.showPreviousArrow = false;
        this.showNextArrow = true;
        this.showResults = false;
        this.showEasyLevel = true;
        this.showMediumLevel = false;
        this.showHardLevel = false;
        this.showCorrectIcon = false;
        this.showIncorrectIcon = false;
        this.readFirebaseData();
    }

    async startTimer() {
        this.timer = this.globalTime;
        setInterval(() => {
            this.updateTimeValue();
        }, 1000);

        let loading = this.loadingController.create({
            content: 'Cargando quiz...'
        });

        this.getQuiz();
        loading.present();

        setTimeout(() => {
            this.nextSlide();
        }, 1000);

        setTimeout(() => {
            loading.dismiss();
        }, 1000);
    }

    percentageOffset(percent) {
        const percentFloat = percent / 100;
        return circleDasharray * (1 - percentFloat);
    }

    updateTimeValue() {
        let minutes: any = this.timer / 60;
        let seconds: any = this.timer % 60;

        minutes = String('0' + Math.floor(minutes)).slice(-2);
        seconds = String('0' + Math.floor(seconds)).slice(-2);

        const text = minutes + ':' + seconds;

        this.time.next(text);
        const totalTime = this.globalTime;
        const percentage = ((totalTime - this.timer) / totalTime) * 100;
        this.percent.next(percentage);
        --this.timer;

        if (minutes == 0 && seconds == 0 && this.resultCall == 0) {
            this.getResults();
        }
    }

    getQuiz() {
        let questions_easy = [];
        let questions_medium = [];
        let questions_hard = [];
        let questions_quiz = [];
        let answer_correct = [];
        let index_easy = [];
        let index_medium = [];
        let index_hard = [];
        let maxTries = 10;

        this.dataService.load().then((data) => {
            data.map((question) => {
                let originalOrder = question.answers;
                question.answers = this.randomizeAnswers(originalOrder);
                if (question.level == "Fácil") {
                    questions_easy.push(question);
                } else if (question.level == "Intermedio") {
                    questions_medium.push(question);
                } else {
                    questions_hard.push(question);
                }
            });
            for (let i = 1; i <= 4; i++) {
                let question = 0;
                let tries = 0;
                do {
                    question = Math.floor(Math.random() * questions_easy.length);
                    tries++;
                } while (index_easy.includes(question) == true && tries < maxTries);
                index_easy.push(question);
                questions_quiz.push(questions_easy[question]);
                this.question_text.push(questions_easy[question].questionText);

                for (let j = 0; j <= 3; j++) {
                    if (questions_easy[question].answers[j].correct) {
                        answer_correct.push(questions_easy[question].answers[j].answer);
                    }
                }
            }
            for (let i = 1; i <= 3; i++) {
                let question = 0;
                let tries = 0;

                do {
                    question = Math.floor(Math.random() * questions_medium.length);
                    tries++;
                } while (index_medium.includes(question) == true && tries < maxTries);
                index_medium.push(question);
                questions_quiz.push(questions_medium[question]);
                this.question_text.push(questions_medium[question].questionText);

                for (let j = 0; j <= 3; j++) {
                    if (questions_medium[question].answers[j].correct) {
                        answer_correct.push(questions_medium[question].answers[j].answer);
                    }
                }
            }
            for (let i = 1; i <= 3; i++) {
                let question = 0;
                let tries = 0;
                do {
                    question = Math.floor(Math.random() * questions_hard.length);
                    tries++;
                } while (index_hard.includes(question) == true && tries < maxTries);
                index_hard.push(question);
                questions_quiz.push(questions_hard[question]);
                this.question_text.push(questions_hard[question].questionText);

                for (let j = 0; j <= 3; j++) {
                    if (questions_hard[question].answers[j].correct) {
                        answer_correct.push(questions_hard[question].answers[j].answer);
                    }
                }
            }
            console.log(index_easy);
            console.log(index_medium);
            console.log(index_hard);
            this.questions = questions_quiz;
            this.correctAnswer = answer_correct;
        });
    }

    nextSlide() {
        let currentIndex = this.slides.getActiveIndex();
        if (currentIndex == 9) {
            this.showHardLevel = true;
            this.showMediumLevel = false;
            this.showEasyLevel = false;
            this.showNextArrow = false;
            this.showResults = true;
            this.slides.lockSwipes(false);
            this.slides.slideNext();
            this.slides.lockSwipes(true);
        } else if (currentIndex >= 7) {
            this.showHardLevel = true;
            this.showMediumLevel = false;
            this.showEasyLevel = false;
            this.slides.lockSwipes(false);
            this.slides.slideNext();
            this.slides.lockSwipes(true);
        } else if (currentIndex >= 4) {
            this.showMediumLevel = true;
            this.showEasyLevel = false;
            this.slides.lockSwipes(false);
            this.slides.slideNext();
            this.slides.lockSwipes(true);
        } else {
            this.slides.lockSwipes(false);
            this.slides.slideNext();
            this.slides.lockSwipes(true);
        }

        if (this.myFuncCalls >= 1) {
            this.showPreviousArrow = true;
        } else {
            this.showPreviousArrow = false;
        }
        this.myFuncCalls++;
    }

    previousSlide() {
        this.showNextArrow = true;
        this.showResults = false;
        let currentIndex = this.slides.getActiveIndex();
        if (currentIndex == 2) {
            this.slides.lockSwipes(false);
            this.slides.slidePrev();
            this.showPreviousArrow = false;
            this.slides.lockSwipes(true);
        } else if (currentIndex < 6) {
            this.showMediumLevel = false;
            this.showHardLevel = false;
            this.showEasyLevel = true;
            this.slides.lockSwipes(false);
            this.slides.slidePrev();
            this.slides.lockSwipes(true);
        } else if (currentIndex < 9) {
            this.showMediumLevel = true;
            this.showHardLevel = false;
            this.showEasyLevel = false;
            this.slides.lockSwipes(false);
            this.slides.slidePrev();
            this.slides.lockSwipes(true);
        } else {
            this.showHardLevel = true;
            this.showMediumLevel = false;
            this.slides.lockSwipes(false);
            this.slides.slidePrev();
            this.slides.lockSwipes(true);
        }
    }

    selectAnswer(answer) {
        let currentPageIndex = (this.slides.getActiveIndex()) - 1;
        this.hasAnswered = true;
        answer.selected = true;
        this.answerArray.splice(currentPageIndex, 1, answer.answer);
        this.hasAnswered = false;
        answer.selected = false;
    }

    randomizeAnswers(rawAnswers: any[]): any[] {
        for (let i = rawAnswers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = rawAnswers[i];
            rawAnswers[i] = rawAnswers[j];
            rawAnswers[j] = temp;
        }
        return rawAnswers;
    }

    getResults() {
        console.log("Results call");
        this.resultCall++;

        let loading = this.loadingController.create({
            content: 'Calculando resultados...'
        });

        loading.present();

        setTimeout(() => {
            loading.dismiss();
            this.mergeResults();
            this.postResults();
            console.log(this.results);
            this.slides.lockSwipes(false);
            this.slides.slideTo(11);
            this.slides.lockSwipes(true);
        }, 500);

    }

    mergeResults() {
        let veredict;
        let icon;
        for (let i = 0; i < 10; i++) {
            if (this.answerArray[i] == this.correctAnswer[i]) {
                veredict = "Correcta";
                icon = "checkmark-circle";
                if (i < 4) {
                    this.score = this.score + 5.5;
                    console.log(this.score);
                } else if (i > 3 && i < 7) {
                    this.score = this.score + 10.5;
                    console.log(this.score);
                } else {
                    this.score = this.score + 15.5;
                    console.log(this.score);
                }
            } else {
                veredict = "Incorrecta";
                icon = "close-circle";
            }

            this.results.splice(i, 1, {
                question_text: this.question_text[i],
                question_answer: this.correctAnswer[i],
                user_answer: this.answerArray[i],
                result_veredict: veredict,
                result_icon: icon,
                score: this.score,
            });
        }
    }

    postResults() {
        const id = this.user.getUID();
        const result_post = [{}];
        let date = new Date().toISOString().substring(0, 10);
        for (let i = 0; i < this.results.length; i++) {
            result_post.splice(i, 1, {
                fecha: date,
                pregunta: this.results[i].question_text,
                respuesta_correcta: this.results[i].question_answer,
                respuesta_seleccionada: this.results[i].user_answer,
                calificacion: this.results[i].score,
            })
        }

        console.log("post", result_post);

        this.afstore.doc(`Usuarios/${id}`).update({
            Resultados: firestore.FieldValue.arrayUnion({
                result_post,
            })
        });
    }

}
