import { Component, ViewChild } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxCaptureService } from "ngx-capture";
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quiz-maker-questions',
  templateUrl: './quiz-maker-questions.component.html',
  styleUrls: ['./quiz-maker-questions.component.css'] 
})

export class QuizMakerQuestionsComponent {
  existingQuestions: QuestionTeacher[] = [];

  initQuestion: boolean = false;
  loading: boolean = false;

  question: QuestionTeacher = {
    questionText: 'New Question',
    answerTimeInSeconds: 0,
    previewTime: 0,
    answers: [],
    questionNumber: 0,
    imageName: undefined,
    snapshot: undefined,
    showMultipleChoice: false
  };

  quizTitle: string = '';
  quizId: number | undefined; 

  @ViewChild('questionScreen', { static: true }) screen: any;

  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private configurationService: ConfigurationService, private captureService:NgxCaptureService) {
  }

  ngOnInit() {
    console.log("refetch Quesitons");
    this.refetchQuestions();

    this.route.queryParams.subscribe(params => {
      if (typeof params['quizName'] !== 'undefined') {
        this.quizTitle = params['quizName'];
      }

      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = params['quizId'];
      }

      if (typeof params['questionNumber'] !== 'undefined') {
        this.displayQuestion(Number.parseInt(params['questionNumber']));
      } else {
        this.initNewQuestion();
      }
    });
  }

  initNewQuestion() {
    this.question = {
      questionText: '',
      answerTimeInSeconds: 15,
      previewTime: 5,
      answers: [],
      questionNumber: 0,
      imageName: undefined,
      showMultipleChoice: false
    };

    for (let i = 0; i < 4; i++) {
      this.question.answers.push({answerText: '', isCorrect: false});
    }

    this.initQuestion = true;
  }

  refetchQuestions() {
    this.existingQuestions = this.configurationService.getQuestions();
  }

  validateQuestion() {
    if (this.question.questionText === undefined || this.question.questionText === '' || this.isWhitespaceString(this.question.questionText) 
    || this.question.answers[0].answerText === undefined || this.question.answers[0].answerText === '' || this.isWhitespaceString(this.question.answers[0].answerText) 
    || this.question.answers[1].answerText === undefined || this.question.answers[1].answerText === '' || this.isWhitespaceString(this.question.answers[1].answerText)) {
      return false;
    }
    return true;
  }

  isWhitespaceString(str: string): boolean {
    return !str.trim();
  }

  async onQuestionCreate() {
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
    if (this.initQuestion === false 
      || ((this.question.questionText === undefined || this.question.questionText === '' || this.isWhitespaceString(this.question.questionText)) 
        && (this.question.answers[0].answerText === undefined || this.question.answers[0].answerText === '' || this.isWhitespaceString(this.question.answers[0].answerText)) 
        && (this.question.answers[1].answerText === undefined || this.question.answers[1].answerText === '' || this.isWhitespaceString(this.question.answers[1].answerText)))){
          this.loading = true;
      await this.captureService.getImage(this.screen.nativeElement, true).toPromise().then((img) => {
        this.question.snapshot = img;
        this.loading = false;
      });
  
      this.initNewQuestion();
      this.refetchQuestions();
    } else {
      if (this.validateQuestion() == false){
        alert('Please fill in all necessary fields and save the question.');
      } else {
        alert('Save the question first before adding a new one.')
      }
    }   
  }

  async onQuestionAdd() {
    const isQuestionValid = this.validateQuestion();

    if (!isQuestionValid) {
      alert('Please fill in all necessary fields to save the question. (no whitespaces allowed)');
      return;
    }
    this.loading = true;
    this.captureService.getImage(this.screen.nativeElement, true).toPromise().then((img) => {
      this.question.snapshot = img;
      this.loading = false;
    });

    this.configurationService.addQuestion(this.question);
    this.initQuestion = false;
  }

  onQuizTitle() {
    if (this.initQuestion === false 
    || (this.question.questionText === undefined || this.question.questionText === '' || this.isWhitespaceString(this.question.questionText) 
       && this.question.answers[0].answerText === undefined || this.question.answers[0].answerText === '' || this.isWhitespaceString(this.question.answers[0].answerText) 
       && this.question.answers[1].answerText === undefined || this.question.answers[1].answerText === '' || this.isWhitespaceString(this.question.answers[1].answerText))) {
      
        this.loading = true;
        this.captureService.getImage(this.screen.nativeElement, true).toPromise().then((img) => {
          this.question.snapshot = img;
          this.loading = false;
        });
        this.router.navigate(['/quizMaker'], {queryParams: {quizName: this.quizTitle, quizId: this.quizId}});
    } else if (this.validateQuestion() === false) {
      alert('Please fill in all necessary fields and save the question first.');
    }
  }

  doesQuestionExist(question: QuestionTeacher) {
    return this.existingQuestions.some(existingQuestion => 
      existingQuestion.questionText === question.questionText &&
      existingQuestion.answerTimeInSeconds === question.answerTimeInSeconds &&
      existingQuestion.previewTime === question.previewTime &&
      JSON.stringify(existingQuestion.answers) === JSON.stringify(question.answers) &&
      existingQuestion.imageName === question.imageName
    );
  }

  async displayQuestion(data: number | QuestionTeacher) {
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }

    if (typeof data === 'number') {
      this.refetchQuestions()

      const searchResult = this.existingQuestions.find(question => question.questionNumber === data);
      if (!searchResult) {
        alert('Question not found');
        return
      }
      this.question = searchResult;
    } else {
      if (this.question.questionText !== data.questionText || !this.arrayEqual(this.question.answers, data.answers) ||
          this.question.answerTimeInSeconds !== data.answerTimeInSeconds || this.question.previewTime !== data.previewTime || this.question.imageName !== data.imageName) {
          this.loading = true;
          await this.captureService.getImage(this.screen.nativeElement, true).toPromise().then((img) => {
            this.question.snapshot = img;
            this.loading = false;
          });
        }

      if (this.initQuestion === false && this.validateQuestion()
      || ((this.question.questionText === undefined || this.question.questionText === '' || this.isWhitespaceString(this.question.questionText)) 
        && (this.question.answers[0].answerText === undefined || this.question.answers[0].answerText === '' || this.isWhitespaceString(this.question.answers[0].answerText)) 
        && (this.question.answers[1].answerText === undefined || this.question.answers[1].answerText === '' || this.isWhitespaceString(this.question.answers[1].answerText)))){
          this.question = data as QuestionTeacher;
        } else {
          alert('Please fill in all necessary fields and save the question.');         
        }
    }
  }

  arrayEqual(a: any[], b: any[]): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  handleFileInput(event: any) {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      const file = files.item(0);
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.question.imageName = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.')
      }
    } else {
      alert('Please select an image file.')
    }
  }

  onDeleteImage(){
    this.question.imageName = undefined;
  }

  decrement(type: "answerTime" | "previewTime") {
    if (type === 'answerTime' && this.question.answerTimeInSeconds > 5) {
      this.question.answerTimeInSeconds--;
    } else if (type === 'previewTime' && this.question.previewTime > 3) {
      this.question.previewTime--;
    }
  }

  increment(type: "answerTime" | "previewTime") {
    if (type === 'answerTime') {
      this.question.answerTimeInSeconds++;
    } else if (type === 'previewTime') {
      this.question.previewTime++;
    }
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    console.log('toggleMobileMenu');
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
