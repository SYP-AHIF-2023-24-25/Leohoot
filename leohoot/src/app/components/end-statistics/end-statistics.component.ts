import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    
  }
  
  ngOnInit(): void {
    //quizid = ???
    this.restservice.getGameStatistics(1).subscribe((data) => {
      this.questions = data.questions;
    });

    console.log(this.questions)
  }

  showStatistics() {
    this.displayStatistics = !this.displayStatistics;
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

}
