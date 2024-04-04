import { Component } from '@angular/core';
import {QuestionTeacher} from "../../../model/question-teacher";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../../services/rest.service";
import {SignalRService} from "../../../services/signalr.service";
import {Quiz} from "../../../model/quiz";
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-games',
  templateUrl: './quiz-overview.component.html',
  styleUrls: []
})
export class QuizOverviewComponent {
  quizzes: Quiz[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService, private configurationService: ConfigurationService) {

  }

  ngOnInit() {
    this.restservice.getAllQuizzes().subscribe((data) => {
      this.quizzes = data;
      console.log(this.quizzes)
    });
  }

  goToWaitingroom(quizId: number) {
    this.router.navigate(['/waitingroom'], { queryParams: { quizId:  quizId} });
  }

  goToQuizMaker(quizId: number) {
    this.router.navigate(['/quizMaker'], { queryParams: { quizId:  quizId} });
  }

  deleteQuiz(quizId: number) {
    this.restservice.deleteQuiz(quizId).subscribe(() => {
      console.log('Quiz deleted successfully');
      location.reload();
    }, error => {
      console.error('Error occurred while deleting quiz:', error);
    });
  }
}
