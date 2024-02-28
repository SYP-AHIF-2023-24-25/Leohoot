import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { get } from 'jquery';
import { Question } from 'src/app/model/question';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { Mode } from 'src/app/model/mode';

@Component({
  selector: 'app-design-quiz',
  templateUrl: './quiz-maker.component.html'
})
export class QuizMakerComponent {
  quizId: number | undefined;
  questions: Question[] = [];
  name: string = "";
  description: string | undefined;
  imageUrl: string | undefined;
  
  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService,  private configurationService: ConfigurationService) {
    this.getParams();
    this.questions = this.configurationService.getQuestions();
    this.description = this.configurationService.getQuiz().description;
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
      quizName: this.name,
    };

    this.configurationService.setQuiz(this.name, this.description ? this.description : '');

    this.router.navigate(['/designQuestion'], { queryParams });
  }

  addQuiz() {
    this.configurationService.setQuiz(this.name, this.description ? this.description : '');
    const quiz = this.configurationService.getQuiz();

    quiz.questions = quiz.questions.filter(question => question.questionText !== undefined || question.questionText !== '');

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

  deleteQuestion(questionNumber: number) {
    this.configurationService.deleteQuestion(questionNumber);
    this.questions = this.configurationService.getQuestions();
  }

  editQuestion(questionNumber: number) {
    const queryParams = {
      quizName: this.name,
      questionNumber: questionNumber
    };

    this.configurationService.setQuiz(this.name, this.description ? this.description : '');

    this.router.navigate(['/designQuestion'], { queryParams });
  }

  playDemoView()
  {
    this.restService.getNewGameId(this.quizId!).subscribe(data => {
      this.router.navigate(['/question'], { queryParams: { gameId: data , mode: Mode.TEACHER_DEMO_MODE } });
    });
  }
}
