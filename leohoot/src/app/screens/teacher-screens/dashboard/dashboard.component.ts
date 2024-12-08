import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Quiz } from "../../../model/quiz";
import { RestService } from "../../../services/rest.service";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { LoginService } from "../../../services/auth.service";
import { Tag } from "../../../model/tag";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  searchText = '';
  isDropdownOpen = false;
  loggedIn = () => this.loginService.isLoggedIn();
  username = this.loginService.getUserName();
  tags: Tag[] = [];
  selectedTags: Tag[] = [];
  viewOwnQuizzes: boolean = false;

  constructor(private restService: RestService, private loginService: LoginService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.fetchQuizzes();
    this.loadTags();

   this.route.queryParams.subscribe(params => {
      console.log(params);
      if (typeof params['viewOwnQuizzes'] !== 'undefined') {
        console.log('View own quizzes');
        console.log(this.viewOwnQuizzes);
       this.viewOwnQuizzes = true;
       this.filteredQuizzes = this.quizzes.filter(quiz => quiz.creator === this.username);
      }
    });
  }
  
  filterQuizzes(): void {
    this.filteredQuizzes = this.quizzes.filter(quiz => {
      const matchesSearchText = quiz.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        quiz.description.toLowerCase().includes(this.searchText.toLowerCase());
  
      if (this.selectedTags.length > 0) {
        return matchesSearchText && this.selectedTags.every(tag =>
          quiz.tags.some(qTag => qTag.name === tag.name)
        );
      } else {
        return matchesSearchText;
      }
    });
  }

  toggleHome(): void {
    this.viewOwnQuizzes = false;
    this.filteredQuizzes = this.quizzes;
  }
  
  toggleOwnQuizzes(): void {
    this.viewOwnQuizzes = !this.viewOwnQuizzes;
    this.filteredQuizzes = this.quizzes.filter(quiz => quiz.creator === this.username);
  }
  
  // toggleFavoriteQuizzes(): void {
  //   this.filteredQuizzes = this.quizzes.filter(quiz => quiz.favorites.includes(this.username));
  // }

  viewQuizDetails(quiz: Quiz): void {
    this.router.navigate(['/quizDetails'], { queryParams: { quizId: quiz.id } });
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
    this.filterQuizzes(); // Apply tag filtering after search
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

  toggleTagSelection(tag: Tag): void {
    const index = this.selectedTags.findIndex(selectedTag => selectedTag.name === tag.name);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.filterQuizzes();
  }
}
