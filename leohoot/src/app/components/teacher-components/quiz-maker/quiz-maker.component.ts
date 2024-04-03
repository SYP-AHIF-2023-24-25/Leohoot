import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { get } from 'jquery';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { Mode } from 'src/app/model/mode';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Quiz } from 'src/app/model/quiz';

@Component({
  selector: 'app-design-quiz',
  templateUrl: './quiz-maker.component.html'
})
export class QuizMakerComponent {
  quizId: number | undefined;
  existingQuestions: QuestionTeacher[] = [];
  title: string = "";
  description: string | undefined;
  imageName: string | undefined;

  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService,  private configurationService: ConfigurationService) {
    this.getParams();
    this.refetchQuestions();
    this.title = this.configurationService.getQuiz().title;
    this.description = this.configurationService.getQuiz().description;
    this.imageName = this.configurationService.getQuiz().imageName;
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['quizName'] !== 'undefined') {
        this.title = params['quizName'];
      }

      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = Number.parseInt(params['quizId']);

        if (typeof params['mode'] !== 'undefined') {
          this.restService.getQuizById(this.quizId).subscribe(quiz => {
            this.configurationService.setQuiz(quiz);
          });

          console.log(this.configurationService.getQuiz());
        }
      }
    });
  }

  onQuestionCreate() {
    const queryParams = {
      quizName: this.title,
      quizId: this.quizId
    };

    this.configurationService.setQuizTitleAndDescription(this.title, this.description ? this.description : '', this.imageName ? this.imageName : '');

    this.router.navigate(['/quizMakerQuestions'], { queryParams });
  }

  refetchQuestions() {
    this.existingQuestions = this.configurationService.getQuestions();
  }

  saveQuiz() {
    this.configurationService.setQuizTitleAndDescription(this.title, this.description ? this.description : '', this.imageName ? this.imageName : '');
    const quiz = this.configurationService.getQuiz();

    quiz.questions =  quiz.questions.map(question => ({
      ...question,
      answers: question.answers.filter(answer => answer.answerText !== '')
    }));

    if (this.quizId === undefined){
      this.restService.addQuiz(quiz).subscribe(data => {
        this.quizId = data;
      });
    } else {
      this.restService.updateQuiz(this.quizId, quiz);
    }
  }

  handleFileInput(event: any) {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      const file = files.item(0);
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageName = e.target?.result as string;
          this.configurationService.addImage(this.imageName);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.')
      }
    } else {
      alert('Please select an image file.')
    }
  }

  onClose(){
    if (confirm("Are you sure you want to leave? All unsaved changes will be lost.")) {
      this.router.navigate(['/quizOverview']);
    }
  }

  onDeleteImage(){
    this.imageName = undefined;
  }

  drop(event: CdkDragDrop<QuestionTeacher[]>) {
    moveItemInArray(this.existingQuestions, event.previousIndex, event.currentIndex);
    this.configurationService.changeOrderOfQuestions(this.existingQuestions);
    this.refetchQuestions();
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  onQuestionDelete(id: number) {
    this.configurationService.deleteQuestion(id);
    this.refetchQuestions();
  }

  onQuestionEdit(questionNumber: number) {
    const queryParams = {
      quizName: this.title,
      questionNumber: questionNumber,
      quizId: this.quizId
    };

    this.configurationService.setQuizTitleAndDescription(this.title, this.description ? this.description : '', this.imageName ? this.imageName : '');

    this.router.navigate(['/quizMakerQuestions'], { queryParams });
  }

  playDemoView()
  {
    this.restService.getNewGameId(this.quizId!).subscribe(data => {
      this.router.navigate(['/question'], { queryParams: { gameId: data , mode: Mode.TEACHER_DEMO_MODE, quizId: this.quizId } });
    });
  }

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
