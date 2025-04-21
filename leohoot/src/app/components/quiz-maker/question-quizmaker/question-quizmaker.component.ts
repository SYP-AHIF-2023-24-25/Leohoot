import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Quiz } from 'src/app/model/quiz';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-question-quizmaker',
  templateUrl: './question-quizmaker.component.html'
})
export class QuestionQuizmakerComponent {
  quiz: Quiz | undefined;

  @ViewChild('questionScreen', { static: false }) screen: any;

  @Input() question: QuestionTeacher = {
    questionText: '',
    answerTimeInSeconds: 0,
    previewTime: 0,
    answers: [],
    questionNumber: 0,
    imageName: undefined,
    snapshot: undefined,
    showMultipleChoice: false
  };

  @Input() loading: boolean = false;
  @Input() quizId: number = -1;
  @Input() editQuizDetails: boolean = false;

  @Input()
  set newQuiz(value: Quiz | undefined) {
    this.quiz = value;
  }

  @Output() createSnapshot = new EventEmitter<void>();
  @Output() questionChanged = new EventEmitter<QuestionTeacher>();
  @Output() saveQuiz = new EventEmitter<void>();

  constructor(private alertService: AlertService, private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private captureService: NgxCaptureService) {
  }

  emitChanges() {
    this.questionChanged.emit(this.question);
  }

  ngInit() {
    this.route.queryParams.subscribe(async params => {
      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = parseInt(params['quizId']);
        
      }
    })

  }
  
  async displayQuestion(data: number | QuestionTeacher){
    if (typeof data === 'number') {
      const searchResult = this.quiz?.questions.find(question => question.questionNumber === data);
      if (!searchResult) {
        this.alertService.show('error', "Question not found.");
        return
      }
      
        this.restService.updateQuestion(this.quizId, searchResult).subscribe(data => {
          console.log(data);
        });
        this.question = searchResult;
        const missingAnswersCount = 4 - this.question.answers.length;
        if (missingAnswersCount > 0) {
          for (let i = 0; i < missingAnswersCount; i++) {
            this.question.answers.push({ answerText: '', isCorrect: false });
          }
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
          const imageString = e.target?.result as string;

          const extension = file.name.split('.').pop();
          let questionNumber = this.question.questionNumber;
          if (this.question.questionNumber === 0) {
            questionNumber = (this.quiz?.questions?.length ?? 0) + 1;
          }

          const fileName = "questionImage_" + questionNumber.toString().padStart(2, '0') + "." + extension;

          this.uploadImage(imageString, fileName).subscribe(data => {
            this.getImageFromServer(data);
          });
        };
        reader.readAsDataURL(file);
      } else {
        this.alertService.show('info', "Please select an image file.");
      }
    } else {
      this.alertService.show('info', "Please select an image file.");
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = params['quizId'];
      }
      this.initNewQuestion();
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
  }

  onDeleteImage(){
    this.question.imageName = undefined;
    this.emitChanges();
  }

  isWhitespaceString(str: string): boolean {
    return !str.trim();
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
  
  async onQuestionAdd() {
    if (this.question.answers.every(answer => !answer.isCorrect)) {
      this.alertService.show('info', "At least one answer must be correct.");
      return;
    }

    this.loading = true;
    await this.createQuestionSnapshot();

    if (this.quiz) {
      this.question.questionNumber = this.quiz.questions.length + 1;
      this.quiz.questions.push(this.question);
      this.emitChanges();
      this.saveQuiz.emit();
    }
    this.loading = false;
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

  getImageFromServer(imageUrl: string) {
    this.question.imageName = this.restService.getImage(imageUrl);
  }

  uploadImage(imageString: string, fileName: string) {
    const imageBlob = this.dataURItoBlob(imageString);

    const formData = new FormData();

    formData.append('image', imageBlob, fileName);

    return this.restService.addImage(formData);
  }

  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  async createQuestionSnapshot() {
    this.loading = true;
    await this.captureService.getImage(this.screen.nativeElement, true).toPromise().then(async (img) => {
      let questionNumber = this.question.questionNumber;

      if (this.question.questionNumber === 0) {
        questionNumber = this.quiz!.questions.length + 1;
      }
      const fileName = "snapshot_" + questionNumber.toString().padStart(2, '0') + ".png";

      const data = await this.uploadImage(img!, fileName).toPromise();
      const existingQuestion = this.quiz?.questions.find(q => q.questionNumber === this.question.questionNumber);
      if (existingQuestion) {
        existingQuestion.snapshot = this.restService.getImage(data!);
      } else {
        this.question.snapshot = this.restService.getImage(data!);
      }
    });
    this.loading = false;
  }
  
}
