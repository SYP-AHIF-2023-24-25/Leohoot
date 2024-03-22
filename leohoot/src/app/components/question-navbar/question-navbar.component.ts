import { Component } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-question-navbar',
  templateUrl: './question-navbar.component.html'
})
export class QuestionNavbarComponent {
  existingQuestions: string[] = [
    "LinQ Statements",
    "Integralrechnung",
    "Ableitungsregeln",
    "Vokabeltest"
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.existingQuestions, event.previousIndex, event.currentIndex);
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  isMobileMenuOpen = false;
  isProfileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

}
