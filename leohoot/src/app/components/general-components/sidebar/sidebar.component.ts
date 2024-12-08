import { Component, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  selectedItem: string = ''; 

  @Output() home = new EventEmitter<void>();
  @Output() ownQuizzes = new EventEmitter<void>();
  @Output() favorites = new EventEmitter<void>();

  ngInit(){
    this.selectedItem = "home";
  }

  toggleHome(): void {
    this.home.emit();
  }

  toggleOwnQuizzes(): void {
    this.ownQuizzes.emit();
  }

  // toggleFavorites(): void {
  //   this.favorites.emit();
  // }

  selectItem(item: string): void {
    this.selectedItem = item;
  }

}
