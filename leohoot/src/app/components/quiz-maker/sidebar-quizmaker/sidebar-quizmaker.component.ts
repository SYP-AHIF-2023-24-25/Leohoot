import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { Quiz } from 'src/app/model/quiz';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-quiz-maker-sidebar',
  templateUrl: './sidebar-quizmaker.component.html',
  styleUrls: ['./sidebar-quizmaker.component.css']
})
export class QuizMakerSidebarComponent {
  @Input() quizTitle: string | undefined;

  @Output() onInitNewQuestion = new EventEmitter<void>();
  @Output() onDisplay = new EventEmitter<number>();
  @Output() onDeleteQuestion = new EventEmitter<number>();

  quiz: Quiz | undefined;

  @Input() quizId: number | undefined;

  @Input()
  set newQuiz(value: Quiz | undefined) {
    this.quiz = value;
  }

  @Output() close = new EventEmitter<void>();
  @Output() saveQuiz = new EventEmitter<string>();

  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private captureService:NgxCaptureService) {
  }

  leaveQuizmaker() {
    this.close.emit();
  }

  drop(event: CdkDragDrop<QuestionTeacher[]>) {
    if (this.quiz?.questions) {
      moveItemInArray(this.quiz.questions, event.previousIndex, event.currentIndex);
      this.quiz?.questions.forEach((question, index) => {
        question.questionNumber = index + 1; 
      });
    }
  }
  
  createQuestion(){
    this.onInitNewQuestion.emit();
  }

  onQuestionSelect(question: QuestionTeacher) {
    this.onDisplay.emit(question.questionNumber);
  }
  
  onQuestionDelete(id: number) {
    this.onDeleteQuestion.emit(id);
  }
}
