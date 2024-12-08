import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { RestService } from "../../../services/rest.service";
import { Quiz } from "../../../model/quiz";
import { LoginService } from "../../../services/auth.service";

@Component({
  selector: 'app-quiz-detail-page',
  templateUrl: './quiz-detail-page.component.html',
})
export class QuizDetailPageComponent {
  quizId: number = 0;
  quiz?: Quiz;
  username: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private restService: RestService, private loginService: LoginService) {

  }
  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = parseInt(params['quizId']);
        await this.getQuiz()
      }
    })
    this.username = this.loginService.getUserName()
  }

  async getQuiz() {
    this.restService.getQuizById(this.quizId).subscribe((data) => {
      this.quiz = data;
    })
  }
}
