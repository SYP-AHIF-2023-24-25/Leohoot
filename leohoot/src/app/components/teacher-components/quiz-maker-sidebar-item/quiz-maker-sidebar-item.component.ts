import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionTeacher } from 'src/app/model/question-teacher';

@Component({
  selector: 'app-quiz-maker-sidebar-item',
  templateUrl: './quiz-maker-sidebar-item.component.html',
  styleUrl: './quiz-maker-sidebar-item.component.css'
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
