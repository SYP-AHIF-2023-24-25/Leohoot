import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Quiz } from 'src/app/model/quiz';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-question-quizmaker',
  templateUrl: './question-quizmaker.component.html'
})
export class QuestionQuizmakerComponent {
  quiz: Quiz | undefined;
  @Input() initQuestion: boolean = false;
  loading: boolean = false;
  @ViewChild('questionScreen', { static: false }) screen: any;

  @Input() question: QuestionTeacher = {
    questionText: 'New Question',
    answerTimeInSeconds: 0,
    previewTime: 0,
    answers: [],
    questionNumber: 0,
    imageName: undefined,
    snapshot: undefined,
    showMultipleChoice: false
  };

  @Input() quizId: number = -1;

  @Input()
  set newQuiz(value: Quiz | undefined) {
    this.quiz = value;
  }

  @Output() createSnapshot = new EventEmitter<void>();
  @Output() questionChange = new EventEmitter<QuestionTeacher>();
  @Output() addQuestion = new EventEmitter<void>();
  @Output() questionAdded = new EventEmitter<void>();

  emitChanges() {
    this.questionChange.emit(this.question);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['question']) {
      console.log('Question updated:', this.question);
    }
  }
  

  updateQuestion(newQuestion: QuestionTeacher) {
    this.question = newQuestion;
    this.cdr.detectChanges(); // Erzwingt das Aktualisieren des Templates
  }
  

  constructor(private cdr: ChangeDetectorRef, private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private configurationService: ConfigurationService, private captureService: NgxCaptureService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
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

  async onQuestionAdd() {
    const isQuestionValid = this.validateQuestion();

    if (!isQuestionValid) {
      alert('Please fill in all necessary fields to save the question. (no whitespaces allowed)');
      return;
    }

    console.log("xreate snapshot")
    await this.createQuestionSnapshot();

    console.log(this.question);
    this.configurationService.addQuestion(this.question);
    this.initQuestion = false;
    console.log(this.configurationService.getQuestions());
    this.questionAdded.emit();
  }

  async createQuestionSnapshot() {
    this.loading = true;
    await this.captureService.getImage(this.screen.nativeElement, true).toPromise().then(async (img) => {
      let questionNumber = this.question.questionNumber;

      if (this.question.questionNumber === 0) {
        questionNumber = this.configurationService.getQuestions().length + 1;
      }
      const fileName = "snapshot_" + questionNumber.toString().padStart(2, '0') + ".png";

      const data = await null;//this.uploadImage(img!, fileName).toPromise();
      this.question.snapshot = this.restService.getImage(data!);

      this.loading = false;
    });
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

  async displayQuestion(data: number | QuestionTeacher) {
    // if (this.isMobileMenuOpen) {
    //   this.toggleMobileMenu();
    // }

    if (typeof data === 'number') {
      const searchResult = this.configurationService.getQuestions().find(question => question.questionNumber === data);
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
          await this.createSnapshot.emit();

          this.question = data as QuestionTeacher;
          this.initQuestion = false;
        } else {
          alert('Please fill in all necessary fields and save the question.');
        }
    }
  }

  arrayEqual(a: any[], b: any[]): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }  

  decrement(type: "answerTime" | "previewTime") {
    if (type === 'answerTime' && this.question.answerTimeInSeconds > 5) {
      this.question.answerTimeInSeconds--;
    } else if (type === 'previewTime' && this.question.previewTime > 3) {
      this.question.previewTime--;
    }
    this.emitChanges();
  }

  increment(type: "answerTime" | "previewTime") {
    if (type === 'answerTime') {
      this.question.answerTimeInSeconds++;
    } else if (type === 'previewTime') {
      this.question.previewTime++;
    }
    this.emitChanges();
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  onDeleteImage(){
    this.question.imageName = undefined;
    this.emitChanges();
  }
}
