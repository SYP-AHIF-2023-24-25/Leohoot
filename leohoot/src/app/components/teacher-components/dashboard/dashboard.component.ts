import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Quiz} from "../../../model/quiz";
import {RestService} from "../../../services/rest.service";
import {RouterLink} from "@angular/router";
import {LoginService} from "../../../services/auth.service";
import {NgForOf, NgIf} from "@angular/common";
import {Tag} from "../../../model/tag";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIf,
    NgForOf
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  searchText = '';
  isDropdownOpen = false;
  loggedIn = () => this.loginService.isLoggedIn();
  username = this.loginService.getUserName();
  viewOwnQuizzes: boolean = false;
  tags: Tag[] = [];

  constructor(private restService: RestService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.fetchQuizzes();
  }

  toggleOwnQuizzes(): void {
    this.viewOwnQuizzes = !this.viewOwnQuizzes;
    this.filterQuizzes();
  }

  filterQuizzes(): void {
    if (this.viewOwnQuizzes) {
      this.filteredQuizzes = this.quizzes.filter((quiz) => quiz.creator === this.username);
    } else {
      this.filteredQuizzes = this.quizzes;
    }
  }

  fetchQuizzes(): void {
    this.restService.getAllQuizzes().subscribe((data: Quiz[]) => {
      this.quizzes = data;
      this.filteredQuizzes = data;
    });
  }

  search(input: string): void {
    if (!input) {
      this.filteredQuizzes = this.quizzes;
      return;
    }
    this.filteredQuizzes = this.quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(input.toLowerCase()) ||
      quiz.description.toLowerCase().includes(input.toLowerCase())
    );
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  async logout() {
    await this.loginService.logout();
  }

  async login(loginWithKeycloak: boolean) {
    await this.loginService.login(loginWithKeycloak);
  }

  loadTags(): void {
    this.restService.getAllTags().subscribe(
      (tags) => {
        this.tags = tags;
      },
      (error) => {
        console.error('Failed to load tags:', error);
      }
    );
  }
}
