import { Component } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-quiz-maker-questions',
  templateUrl: './quiz-maker-questions.component.html',
  styleUrls: ['./quiz-maker-questions.component.css'] 
})

export class QuizMakerQuestionsComponent {
  existingQuestions: QuestionTeacher[] = [];

  initQuestion: boolean = false;

  question: QuestionTeacher = {
    questionText: 'New Question',
    answerTimeInSeconds: 0,
    previewTime: 0,
    answers: [],
    questionNumber: 0,
    imageName: undefined
  };

  quizTitle: string = '';

  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private configurationService: ConfigurationService) {
  }

  ngOnInit() {
    console.log("refetch Quesitons");
    this.refetchQuestions();

    this.route.queryParams.subscribe(params => {
      if (typeof params['quizName'] !== 'undefined') {
        this.quizTitle = params['quizName'];
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
      imageName: undefined
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

  onQuestionCreate() {
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
    if (this.initQuestion === false 
      || ((this.question.questionText === undefined || this.question.questionText === '' || this.isWhitespaceString(this.question.questionText)) 
        && (this.question.answers[0].answerText === undefined || this.question.answers[0].answerText === '' || this.isWhitespaceString(this.question.answers[0].answerText)) 
        && (this.question.answers[1].answerText === undefined || this.question.answers[1].answerText === '' || this.isWhitespaceString(this.question.answers[1].answerText)))){
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

  onQuestionAdd() {
    const isQuestionValid = this.validateQuestion();

    if (!isQuestionValid) {
      alert('Please fill in all necessary fields to save the question. (no whitespaces allowed)');
      return;
    }

    this.configurationService.addQuestion(this.question);
    this.initQuestion = false;
  }

  onQuestionDelete(event: MouseEvent, id: number) {
    event.stopPropagation(); 

    if (this.initQuestion === true){
      alert('Save the question first before deleting one.');
      return;
    }

    this.configurationService.deleteQuestion(id);
    this.refetchQuestions();
    
    if (this.existingQuestions.length == 0){
      this.initNewQuestion();
    } else {
      let index = id > 2 ? id - 2 : 0;
      this.displayQuestion(this.existingQuestions[index]);
    }
  }

  onQuizTitle() {
    if (this.initQuestion === false 
    || (this.question.questionText === undefined || this.question.questionText === '' || this.isWhitespaceString(this.question.questionText) 
       && this.question.answers[0].answerText === undefined || this.question.answers[0].answerText === '' || this.isWhitespaceString(this.question.answers[0].answerText) 
       && this.question.answers[1].answerText === undefined || this.question.answers[1].answerText === '' || this.isWhitespaceString(this.question.answers[1].answerText))) {
      this.router.navigate(['/quizMaker'], {queryParams: {quizName: this.quizTitle}});
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

  displayQuestion(data: number | QuestionTeacher) {
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

  drop(event: CdkDragDrop<QuestionTeacher[]>) {
    moveItemInArray(this.existingQuestions, event.previousIndex, event.currentIndex);
    this.configurationService.changeOrderOfQuestions(this.existingQuestions);
    this.refetchQuestions();
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
