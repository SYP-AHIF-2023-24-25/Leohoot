import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-quiz-maker-sidebar',
  templateUrl: './quiz-maker-sidebar.component.html',
  styleUrl: './quiz-maker-sidebar.component.css'
})
export class QuizMakerSidebarComponent {
  @Input() quizTitle: string | undefined;
  @Input() initQuestion: boolean | undefined;

  @Output() onQuizName = new EventEmitter<string>();
  @Output() onCreate = new EventEmitter<void>();
  @Output() onDisplayQuestion = new EventEmitter<QuestionTeacher>();
  @Output() onInitNewQuestion = new EventEmitter<void>();


  existingQuestions: QuestionTeacher[] = [];
  
  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private configurationService: ConfigurationService, private captureService:NgxCaptureService) {
  }

  ngOnInit() {
    this.refetchQuestions();
  }

  drop(event: CdkDragDrop<QuestionTeacher[]>) {
    moveItemInArray(this.existingQuestions, event.previousIndex, event.currentIndex);
    this.configurationService.changeOrderOfQuestions(this.existingQuestions);
    this.refetchQuestions();
  }

  refetchQuestions() {
    this.existingQuestions = this.configurationService.getQuestions();
  }

  onQuizTitle() {
    this.onQuizName.emit(this.quizTitle);
  }
  
  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  onQuestionCreate() {
    this.onCreate.emit();
  }

  onQuestionSelect(question: QuestionTeacher) {
    this.onDisplayQuestion.emit(question);
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
