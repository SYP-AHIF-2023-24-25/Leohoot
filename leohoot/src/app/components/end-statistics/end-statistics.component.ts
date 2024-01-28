import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Player } from 'src/app/model/player';
import { Question } from 'src/app/model/question';
import { Quiz } from 'src/app/model/quiz';
import { Statistic } from 'src/app/model/statistic';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-end-statistics',
  templateUrl: './end-statistics.component.html',
  styleUrls: []
})
export class EndStatisticsComponent {
  displayStatistics: boolean = false;
  questions!: Question[];
  questionAnswers!: { [key: number]: boolean[] };
  resultInPercentage!: string;
  correctAnswers!: number;
  totalAnswers!: number;
  quizTitle!: string;
  topThreePlayers!: Player[];

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    
  }
  
  ngOnInit(): void {
    //quizId = ??
    this.restservice.getQuizById(1).subscribe((data) => {
      this.quizTitle = data.title;
    });

    this.restservice.getGameStatistics(1).subscribe((data) => {
      this.questions = data.questions;
      this.questionAnswers = data.questionAnswers;
    });

    /*this.restservice.getRanking(1, this.questions.length).subscribe((data) => {
      if (data === undefined) {
        this.topThreePlayers = [ {username: "No players yet", score: 0} ];
      }
      if (data.length > 3) {
        this.topThreePlayers = data.slice(0, 3);
      } else {
        this.topThreePlayers = data;
      }
      
    });*/
  }

  showStatistics() {
    this.displayStatistics = !this.displayStatistics;
  }

  calculateResults(questionNumber: number) {
    if (!this.questionAnswers[questionNumber]) {
       this.resultInPercentage = "0 %";
       this.correctAnswers = 0;
        this.totalAnswers = 0;
    } else {
      this.correctAnswers = this.questionAnswers[questionNumber].filter((answer) => answer === true).length;
      this.totalAnswers = this.questionAnswers[questionNumber].length;

      if (this.totalAnswers > 0) {
        this.resultInPercentage = (this.correctAnswers / this.totalAnswers * 100).toFixed(2) + " %";
      } else {
        this.resultInPercentage = "0 %";
      }
    }
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
