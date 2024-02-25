import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Question } from 'src/app/model/question';
import { Answer } from 'src/app/model/answer';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-design-question',
  templateUrl: './design-question.component.html'
})
export class DesignQuestionComponent {
  quizTitle: string = '';
  questionList: string[] = [];

  imageUrl: string | undefined;
  title: string | undefined;
  answerTime: number;
  previewTime: number;

  answer01: string | undefined;
  answer01Checkbox: boolean = false;
  answer02: string | undefined;
  answer02Checkbox: boolean = false;
  answer03: string | undefined;
  answer03Checkbox: boolean = false;
  answer04: string | undefined;
  answer04Checkbox: boolean = false;

  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private configurationService: ConfigurationService) {
    this.answerTime = 15;
    this.previewTime = 5;
  }

  ngOnInit() {
    this.questionList = this.configurationService.getQuestions().map(question => question.questionText);
    this.questionList.push('New Question');

    this.getParams();
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['quizName'] !== 'undefined') {
        console.log(params['quizName']);
        this.quizTitle = params['quizName'];
      }

      if (typeof params['questionText'] !== 'undefined') {
        this.displayQuestion(params['questionText']);
      }
    });
  }

  handleFileInput(event: any) {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      const file = files.item(0);
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.')
      }
    } else {
      alert('Please select an image file.')
    }
  }
  
  

  decrement(time: string) {
    if (time === 'answerTime' && this.answerTime > 5){
      this.answerTime--;
    } else if (time === 'previewTime' && this.previewTime > 3){
      this.previewTime--;
    }
  }

  increment(time: string) {
    if (time === 'answerTime'){
      this.answerTime++;
    } else {
      this.previewTime++;
    }
  }



  validateQuestion() {
    if (this.title === undefined || this.title === '' || this.answer01 === undefined || this.answer01 === '' || this.answer02 === undefined || this.answer02 === '') {
      alert('Please fill in all necessary fields to save the question.');
    } else {
      console.log(this.questionList);
      // todo update question
      /*if (this.questionList.includes(this.title) === true){
        
        console.log('updateQuestion');
        this.updateQuestion();
      } else {*/
        if (this.questionList.includes(this.title) === false){
          this.addQuestion();
          this.reloadPage();
        } else {
          alert('This question already exists in the quiz. Please choose a different question title.');
        }
    //}
    }
  }
  addQuestion() {
    const question: Question = {
      questionText: this.title ?? '',
      answerTimeInSeconds: this.answerTime,
      previewTime: this.previewTime,
      answers: [
        { answerText: this.answer01 ?? '', isCorrect: this.answer01Checkbox },
        { answerText: this.answer02 ?? '', isCorrect: this.answer02Checkbox },
        { answerText: this.answer03 ?? '', isCorrect: this.answer03Checkbox },
        { answerText: this.answer04 ?? '', isCorrect: this.answer04Checkbox }
      ],
      id: 0,
      questionNumber: 0,
      nextQuestionId: null,
      imageName: this.imageUrl
    };
    this.configurationService.addQuestion(question);
  }

  updateQuestion() {
    //TODO
  }

  reloadPage() {
    this.questionList = this.configurationService.getQuestions().map(question => question.questionText);
    this.questionList.push('New Question');

    this.title = '';
    this.answerTime = 15;
    this.previewTime = 5;
    this.answer01 = '';
    this.answer01Checkbox = false;
    this.answer02 = '';
    this.answer02Checkbox = false;
    this.answer03 = '';
    this.answer03Checkbox = false;
    this.answer04 = '';
    this.answer04Checkbox = false;
    this.imageUrl = undefined;
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  editQuizName() {
    const queryParams = {
      quizName: this.quizTitle
    };

    if ((this.title === undefined || this.title === '' && this.answer01 === undefined || this.answer01 === '' && this.answer02 === undefined || this.answer02 === '' && this.answer03 === undefined || this.answer03 === '' && this.answer04 === undefined || this.answer04 === '') === true) {
      this.router.navigate(['/designQuiz'], { queryParams });
    } else if (this.title !== undefined && this.title !== '' && this.answer01 !== undefined && this.answer01 !== '' && this.answer02 !== undefined && this.answer02 !== '') {
      this.validateQuestion();
      this.router.navigate(['/designQuiz'], { queryParams });
    } else {
      alert('Please fill in all necessary fields to save the question first.');
    }
  }

  editQuestion(questionText: string) {
      if ((this.title === undefined || this.title === '' && this.answer01 === undefined || this.answer01 === '' && this.answer02 === undefined || this.answer02 === '' && this.answer03 === undefined || this.answer03 === '' && this.answer04 === undefined || this.answer04 === '') === true) {
        this.displayQuestion(questionText);
      } else if (this.title !== undefined && this.title !== '' && this.answer01 !== undefined && this.answer01 !== '' && this.answer02 !== undefined && this.answer02 !== '') {
        this.validateQuestion();
        this.displayQuestion(questionText);
      } else {
        alert('Please fill in all necessary fields to save the question first.');
      }
  }

  displayQuestion(questionText: string) {
    const question = this.configurationService.getQuestions().find(question => question.questionText === questionText);
      this.previewTime = question?.previewTime ?? 5;
      this.answerTime = question?.answerTimeInSeconds ?? 15;
      this.title = question?.questionText;
      this.answer01 = question?.answers[0].answerText;
      this.answer01Checkbox = question?.answers[0].isCorrect ?? false;
      this.answer02 = question?.answers[1].answerText;
      this.answer02Checkbox = question?.answers[1].isCorrect ?? false;
      this.answer03 = question?.answers[2].answerText;
      this.answer03Checkbox = question?.answers[2].isCorrect ?? false;
      this.answer04 = question?.answers[3].answerText;
      this.answer04Checkbox = question?.answers[3].isCorrect ?? false;
  }

  deleteQuestion(questionText: string) {
    this.configurationService.deleteQuestion(questionText);
    this.questionList = this.configurationService.getQuestions().map(question => question.questionText);
  }
}
/*const question = this.configurationService.getQuestions().find(question => question.questionText === this.title);
    /*if (question?.questionText !== this.title
      || question?.answerTimeInSeconds !== this.answerTime
      || question?.previewTime !== this.previewTime
      || question?.answers[0].answerText !== this.answer01
      || question?.answers[0].isCorrect !== this.answer01Checkbox
      || question?.answers[1].answerText !== this.answer02
      || question?.answers[1].isCorrect !== this.answer02Checkbox
      || question?.answers[2].answerText !== this.answer03
      || question?.answers[2].isCorrect !== this.answer03Checkbox
      || question?.answers[3].answerText !== this.answer04
      || question?.answers[3].isCorrect !== this.answer04Checkbox) {
      
        this.configurationService.updateQuestion({
          questionText: this.title ?? '',
          answerTimeInSeconds: this.answerTime,
          previewTime: this.previewTime,
          answers: [
            { answerText: this.answer01 ?? '', isCorrect: this.answer01Checkbox },
            { answerText: this.answer02 ?? '', isCorrect: this.answer02Checkbox },
            { answerText: this.answer03 ?? '', isCorrect: this.answer03Checkbox },
            { answerText: this.answer04 ?? '', isCorrect: this.answer04Checkbox }
          ],
          id: 0,
          questionNumber: 0,
          nextQuestionId: null
        });     
    }
    console.log('updateQuestion');
    console.log(this.configurationService.getQuestions());
    this.configurationService.updateQuestion({
      questionText: this.title ?? '',
      answerTimeInSeconds: this.answerTime,
      previewTime: this.previewTime,
      answers: [
        { answerText: this.answer01 ?? '', isCorrect: this.answer01Checkbox },
        { answerText: this.answer02 ?? '', isCorrect: this.answer02Checkbox },
        { answerText: this.answer03 ?? '', isCorrect: this.answer03Checkbox },
        { answerText: this.answer04 ?? '', isCorrect: this.answer04Checkbox }
      ],
      id: 0,
      questionNumber: 0,
      nextQuestionId: null
    });  
    console.log(this.configurationService.getQuestions());
  }

  addQuestion() {
    const question: Question = {
      questionText: this.title ?? '',
      answerTimeInSeconds: this.answerTime,
      previewTime: this.previewTime,
      answers: [
        { answerText: this.answer01 ?? '', isCorrect: this.answer01Checkbox },
        { answerText: this.answer02 ?? '', isCorrect: this.answer02Checkbox },
        { answerText: this.answer03 ?? '', isCorrect: this.answer03Checkbox },
        { answerText: this.answer04 ?? '', isCorrect: this.answer04Checkbox }
      ],
      id: 0,
      questionNumber: 0,
      nextQuestionId: null
    };
    this.configurationService.addQuestion(question);*/