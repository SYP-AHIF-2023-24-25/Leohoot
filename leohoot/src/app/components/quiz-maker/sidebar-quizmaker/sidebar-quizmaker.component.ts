import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { Quiz } from 'src/app/model/quiz';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-sidebar-quizmaker',
  templateUrl: './sidebar-quizmaker.component.html',
  styleUrls: ['./sidebar-quizmaker.component.css']
})
export class SidebarQuizmakerComponent {
  @Input() quizTitle: string | undefined;
  @Input() initQuestion: boolean | undefined;
  @Input() editMode: boolean = false;

  @Output() onCreate = new EventEmitter<void>();
  @Output() onInitNewQuestion = new EventEmitter<void>();
  @Output() onDisplay = new EventEmitter<number>();

  //existingQuestions: QuestionTeacher[] = [];
  quiz: Quiz | undefined;

  @Input() quizId: number | undefined;

  @Input()
  set newQuiz(value: Quiz | undefined) {
    this.quiz = value;
  }

  @Output() close = new EventEmitter<void>();

  @Output() saveQuiz = new EventEmitter<string>();
  @Output() changeEditMode = new EventEmitter<string>();

  existingQuestions: QuestionTeacher[] = [];
  
  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private configurationService: ConfigurationService, private captureService:NgxCaptureService) {
  }

  ngOnInit() {
    this.refetchQuestions();
  }

  leaveQuizmaker() {
    this.close.emit();
  }

  drop(event: CdkDragDrop<QuestionTeacher[]>) {
    moveItemInArray(this.existingQuestions, event.previousIndex, event.currentIndex);
    this.configurationService.changeOrderOfQuestions(this.existingQuestions);
    this.refetchQuestions();
  }


  refetchQuestions() {
    this.existingQuestions = this.configurationService.getQuestions();
  }
  
  createQuestion(){
    //quiz not saved to db yet
    if(this.quizId === -1 && this.editMode === false){
      console.log('quiz not saved to db yet');
      this.changeEditMode.emit('addQuestion');
      this.saveQuiz.emit('saveQuiz');
      return;
    } else if (this.editMode === false){
      this.changeEditMode.emit('addQuestion');
    }
    this.onCreate.emit();
  }

  onQuestionSelect(question: QuestionTeacher) {
    this.onDisplay.emit(question.questionNumber);
  }
  
  onQuestionDelete(id: number) {
    if (this.initQuestion === true){
      alert('Save the question first before deleting one.');
      return;
    }

    this.configurationService.deleteQuestion(id);
    this.refetchQuestions();
    
    if (this.existingQuestions.length == 0){
      this.onInitNewQuestion.emit();
    } else {
      let index = id > 2 ? id - 2 : 0;
      this.onQuestionSelect(this.existingQuestions[index]);
    }
  }
}
