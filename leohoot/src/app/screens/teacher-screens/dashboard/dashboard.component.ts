import { Component, HostListener } from "@angular/core";
import { Quiz } from "../../../model/quiz";
import { RestService } from "../../../services/rest.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from "../../../services/auth.service";
import { Tag } from "../../../model/tag";
import { DashboardSectionType } from "../../../model/dashboard-section-type";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  searchText = '';
  username = this.loginService.getUserName();
  tags: Tag[] = [];
  selectedTags: Tag[] = [];
  isSidebarVisible = false;
  screenIsLarge = false;
  ownQuizzesSelected: boolean = false;
  favoriteQuizzesSelected: boolean = false;
  isOpen = false;

  constructor(private restService: RestService, private loginService: LoginService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.loadTags();
      this.screenIsLarge = window.innerWidth >= 1024;

     this.route.queryParams.subscribe(params => {
       let section = parseInt(params['section']);
       this.ownQuizzesSelected = section === DashboardSectionType.OWN;
       this.favoriteQuizzesSelected = section === DashboardSectionType.FAVOURITES;
       this.fetchQuizzes();
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

  async viewQuizDetails(quiz: Quiz): Promise<void> {
    await this.router.navigate(['/quizDetails'], { queryParams: { quizId: quiz.id } });
  }

  fetchQuizzes(): void {
    this.restService.getAllQuizzes().subscribe((data: Quiz[]) => {
      console.log(this.ownQuizzesSelected)
      if (this.ownQuizzesSelected) {
        this.quizzes = data.filter(d => d.creator === this.username)
      } else if (this.favoriteQuizzesSelected) {
        this.quizzes = data.filter(d => d.isFavorited && d.isPublic || d.isFavorited && d.creator === this.username);
      } else {
        this.quizzes = data.filter(d => d.isPublic || d.creator === this.username);
      }

      this.filteredQuizzes = this.quizzes;
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
    this.filterQuizzes();
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
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenIsLarge = window.innerWidth >= 1024;
  }
}
