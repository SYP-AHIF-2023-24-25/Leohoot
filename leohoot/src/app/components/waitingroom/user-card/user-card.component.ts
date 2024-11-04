import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html'
})

export class UserCardComponent {
  @Input() name: string = '';
  @Output() delete = new EventEmitter<void>();

  onDelete(): void {
    this.delete.emit();
  }
}
