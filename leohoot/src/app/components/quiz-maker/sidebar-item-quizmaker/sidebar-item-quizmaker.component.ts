import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionTeacher } from 'src/app/model/question-teacher';

@Component({
  selector: 'app-quiz-maker-sidebar-item',
  templateUrl: './sidebar-item-quizmaker.component.html',
  styleUrl: './sidebar-item-quizmaker.component.css'
})
export class QuizMakerSidebarItemComponent {
  @Input() existingQuestion: QuestionTeacher | undefined;

  @Output() onDelete = new EventEmitter<number>();

  onQuestionDelete() {
    this.onDelete.emit(this.existingQuestion!.questionNumber);
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
