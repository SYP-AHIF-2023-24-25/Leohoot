import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { RestService } from 'src/app/services/rest.service';
import { Quiz } from 'src/app/model/quiz';
import { LoginService } from 'src/app/services/auth.service';
import { Tag } from 'src/app/model/tag';
import { NgxCaptureService } from 'ngx-capture';
import { QuizMakerSidebarComponent } from 'src/app/components/quiz-maker/sidebar-quizmaker/sidebar-quizmaker.component';
import { QuestionQuizmakerComponent } from 'src/app/components/quiz-maker/question-quizmaker/question-quizmaker.component';

interface ListItems {
  tag: Tag;
  checked: boolean;
}

@Component({
  selector: 'app-design-quiz',
  templateUrl: './quiz-maker.component.html'
})
export class QuizMakerComponent {
  quizId: number = -1;
  quiz: Quiz = {
    title: "",
    description: "",
    creator: this.loginService.getUserName(),
    questions: [],
    imageName: "",
    isPublic: false,
    tags: []
  };

  username: string = "";
  editQuizDetails: boolean = true;
  loading: boolean = false;

  question: QuestionTeacher = {
    questionText: '',
    answerTimeInSeconds: 15,
    previewTime: 5,
    answers: [],
    questionNumber: 0,
    imageName: undefined,
    snapshot: undefined,
    showMultipleChoice: false
  };

  navQuestion: QuestionTeacher | undefined;
  @ViewChild(QuestionQuizmakerComponent) questionQuizmakerComponent: QuestionQuizmakerComponent | undefined;
  @ViewChild(QuizMakerSidebarComponent) sidebarComponent!: QuizMakerSidebarComponent;

  constructor(private router: Router, private route: ActivatedRoute, private restService: RestService, private loginService: LoginService,  private captureService: NgxCaptureService, private cdr: ChangeDetectorRef) {

  }


  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = parseInt(params['quizId']);
        await this.getQuiz()
      }
    })

    this.username = this.loginService.getUserName()
  }

  async getQuiz() {
    this.restService.getQuizById(this.quizId).subscribe(quiz => {
      console.log(quiz)
      quiz.questions.forEach(question => {
        const missingAnswersCount = 4 - question.answers.length;
        if (missingAnswersCount > 0) {
          for (let i = 0; i < missingAnswersCount; i++) {
            question.answers.push({ answerText: '', isCorrect: false });
          }
        }
      });
      this.quiz = quiz;
  });
}

  async close(){
    if (confirm("Are you sure you want to leave?")) {
      if (this.quizId === -1){
        confirm('Quiz not saved. All changes will be lost.');
        await this.router.navigate(['/dashboard']);
      }
      if (this.editQuizDetails === false && this.question.questionNumber !== 0 && this.validateQuestion() 
      || this.editQuizDetails === false && this.question.questionNumber === 0 && this.validateQuestion() && this.question.questionText === '' //keine neue frage angelegt / halbfertige
        || this.editQuizDetails === true && this.quiz.title !== '' && this.quiz.description !== ''){
        this.saveQuiz();
        await this.router.navigate(['/dashboard']);
      }
    }
  }

  updateQuestion(updatedQuestion: QuestionTeacher) {
    this.question = updatedQuestion;
    console.log('Current question updated:', this.question);
  }


  saveQuiz() {
    this.quiz!.questions =  this.quiz!.questions.map(question => ({
      ...question,
      answers: question.answers.filter(answer => answer.answerText !== '')
    }));
    
    if (this.quizId === -1){
      this.restService.addQuiz(this.quiz!).subscribe(data => {
        this.quizId = data;
        this.route.params.subscribe(params => {
          this.router.navigate(['/quizMaker'], {queryParams: {quizId: this.quizId}});
        });
      });
    } else {
      this.restService.updateQuiz(this.quizId, this.quiz!).subscribe(data => {
       
      });
    }
  }

  changeEditMode(){
    if (this.editQuizDetails === false && this.validateQuestion() && this.question.questionNumber !== 0 ||this.editQuizDetails === false && this.question.questionNumber === 0 && this.validateQuestion() && this.question.questionText === ''){
      this.editQuizDetails = true;
      this.createQuestionSnapshot();
      this.restService.updateQuestion(this.quizId, this.question).subscribe(data => {
      });
    } else if (this.editQuizDetails === false && this.question.questionNumber !== 0 && this.validateQuestion() == false){
      alert('Please fill in all necessary fields.');
      return;
    } else if (this.editQuizDetails === false && this.question.questionNumber === 0 && this.validateQuestion() === false){
      alert('Please fill in all necessary fields and add the question first.');
      return;
    }
  }

  validateQuestion(): boolean {
    if (
      (this.question.questionText === undefined || this.question.questionText === '' || this.isWhitespaceString(this.question.questionText)) &&
      this.question.answers.every(answer => answer.answerText === undefined || answer.answerText === '' || this.isWhitespaceString(answer.answerText))
    ) {
      return true;
    }

    if (this.question.questionText === undefined || this.question.questionText === '' || this.isWhitespaceString(this.question.questionText)) {
      return false;
    }

    for (let i = 0; i < 2; i++) {
      const answer = this.question.answers[i];
      if (answer.answerText === undefined || answer.answerText === '' || this.isWhitespaceString(answer.answerText)) {
        return false;
      }
    }
    
    return true;
  }

  initNewQuestion() {
    if (this.editQuizDetails){
      this.saveQuiz();
      this.editQuizDetails = !this.editQuizDetails;
    } else if (this.editQuizDetails === false && this.question.questionNumber !== 0 && this.validateQuestion()){
       this.quiz.questions.find(question => question.questionNumber === this.question.questionNumber) ? this.updateQuestion(this.question) : this.quiz.questions.push(this.question);
    } else if (this.editQuizDetails === false && this.question.questionNumber !== 0 && this.validateQuestion() == false){
      alert('Please fill in all necessary fields.');
      return;
    } else if (this.editQuizDetails === false && this.question.questionNumber === 0 && this.validateQuestion() === false){
      alert('Please fill in all necessary fields and add the question first.');
      return;
    }

    this.question = {
      questionText: '',
      answerTimeInSeconds: 15,
      previewTime: 5,
      answers: [],
      questionNumber: 0,
      imageName: undefined,
      snapshot: undefined,
      showMultipleChoice: false
    };
    
    for (let i = 0; i < 4; i++) {
      this.question.answers.push({answerText: '', isCorrect: false});
    }
  }

  deleteQuestion(id: number){
    if (this.question.questionNumber === 0 && this.validateQuestion() == false){
      alert('Please fill in all necessary fields and add the question first before deleting another question.');
      return;
    }
      if (this.quiz.questions.length === 1 && this.quiz.questions[0].questionNumber === id) {
        this.quiz.questions = [];
        this.initNewQuestion();
      }

      this.quiz.questions = this.quiz.questions.filter(question => question.questionNumber !== id);
      this.quiz.questions.forEach((question, index) => {
        question.questionNumber = index + 1;
      });
      this.saveQuiz();

      if (this.quiz?.questions.length == 0){
        this.initNewQuestion();
      } else {
        let index = id > 2 ? id - 2 : 0;
        this.displayQuestion(index + 1);
      }
    }
  

  async displayQuestion(data: number | QuestionTeacher){
    if (typeof data === 'number') {
      const searchResult = this.quiz?.questions.find(question => question.questionNumber === data);
      if (!searchResult) {
        alert('Question not found');
        return
      }

      if (this.editQuizDetails || (this.question.questionNumber !== 0 && this.validateQuestion()) || (this.question.questionNumber === 0 && this.validateQuestion())){
        this.loading = true;
        await this.createQuestionSnapshot();
        this.question = searchResult;
        
        const missingAnswersCount = 4 - this.question.answers.length;
        if (missingAnswersCount > 0) {
          for (let i = 0; i < missingAnswersCount; i++) {
            this.question.answers.push({ answerText: '', isCorrect: false });
          }
        }

        if(this.editQuizDetails){
          this.editQuizDetails = false;
        }

        if (!this.questionQuizmakerComponent) {
          this.cdr.detectChanges();
          this.questionQuizmakerComponent = this.questionQuizmakerComponent || this.questionQuizmakerComponent;
        } 
        this.loading = false;
        this.questionQuizmakerComponent?.displayQuestion(data);
        
      } else if (this.question.questionNumber !== 0 && this.validateQuestion() == false){
        alert('Please fill in all necessary fields');
      } else if (this.question.questionNumber === 0 && this.validateQuestion() == false){
        alert('Please fill in all necessary fields and add the question first.');
      }
    } 
  }
  async createQuestionSnapshot() { 
    await this.questionQuizmakerComponent?.createQuestionSnapshot();
  }

  isWhitespaceString(str: string): boolean {
    return !str.trim();
  }
}