import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { get } from 'jquery';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-design-quiz',
  templateUrl: './quiz-maker.component.html'
})
export class DesignQuizComponent {
  questionList: string[] = [];
  name: string = "";
  description: string | undefined;
  imageUrl: string | undefined;
  
  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService,  private configurationService: ConfigurationService) {
    this.getParams();
    this.questionList = this.configurationService.getQuestions().map(question => question.questionText);
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['quizName'] !== 'undefined') {
        this.name = params['quizName'];
      } else {
        this.name = '';
      }
    });
  }

  addQuestion() {
    const queryParams = {
      quizName: this.name
    };

    this.router.navigate(['/designQuestion'], { queryParams });
  }

  addQuiz() {
    this.configurationService.setQuiz(this.name, this.description ? this.description : '');
    const quiz = this.configurationService.getQuiz();

    this.restService.addQuiz(quiz).subscribe(data => {
      console.log(data);
    });

    //TODO LINK MIAS PAGE
  }

  handleFileInput(event: any) {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      const file = files.item(0);
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.')
      }
    } else {
      alert('Please select an image file.')
    }
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  deleteQuestion(questionText: string) {
    this.configurationService.deleteQuestion(questionText);
    this.questionList = this.configurationService.getQuestions().map(question => question.questionText);
  }

  editQuestion(questionText: string) {
    const queryParams = {
      quizName: this.name,
      questionText: questionText
    };

    this.router.navigate(['/designQuestion'], { queryParams });
  }
}
