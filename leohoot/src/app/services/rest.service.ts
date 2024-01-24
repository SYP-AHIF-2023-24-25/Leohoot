import { Injectable } from '@angular/core';
import { Quiz } from '../model/quiz';
import { Question } from '../model/question';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionComponent } from '../components/question/question.component';
import { StudentViewData } from '../model/student-view-data';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  public static url: string = 'http://localhost:5000/api/';
  demoQuiz: Quiz = {
    title: 'Demo Quiz',
    description: 'This is a demo quiz',
    creator: 'Hooti',
    questions: [
      {
        id: 1,
        questionNumber: 1,
        questionText: 'What is the capital of France?',
        previewTime: 5,
        answerTimeInSeconds: 15,
        answers: [
          {
            answerText: 'Lyon',
            isCorrect: false,
          },
          {
            answerText: 'Paris',
            isCorrect: true,
          },
          {
            answerText: 'Marseille',
            isCorrect: false,
          },
          {
            answerText: 'St. Tropez',
            isCorrect: false,
          },
        ],
        imageName: 'assets/images/panorama.jpg',
        nextQuestionId: 2,
      },
      {
        id: 2,
        questionNumber: 2,
        questionText: 'Is Syp cool?',
        previewTime: 5,
        answerTimeInSeconds: 10,
        answers: [
          {
            answerText: 'true',
            isCorrect: true,
          },
          {
            answerText: 'false',
            isCorrect: false,
          },
        ],
        nextQuestionId: 3,
      },
      {
        id: 3,
        questionNumber: 3,
        questionText: 'Which animals are in our mascot?',
        previewTime: 5,
        answerTimeInSeconds: 20,
        answers: [
          {
            answerText: 'Lion',
            isCorrect: true,
          },
          {
            answerText: 'Chicken',
            isCorrect: false,
          },
          {
            answerText: 'Cat',
            isCorrect: false,
          },
          {
            answerText: 'Owl',
            isCorrect: true,
          },
        ],
        nextQuestionId: 4,
        imageName: 'assets/images/hooti.png'
      },
      {
        id: 4,
        questionNumber: 4,
        questionText: 'Du bist Busfahrer. An der 1. Haltestelle steigen 5 Gäste ein. An der 2. Haltestelle steigen 3 Leute zu und 2 aus. An der 3. Haltestelle steigen 4 ein und 5 aus. Wie alt ist der Busfahrer?',
        previewTime: 5,
        answerTimeInSeconds: 30,
        answers: [
          {
            answerText: '18, er ist Fahranfänger',
            isCorrect: false,
          },
          {
            answerText: 'Der Busfahrer existiert gar nicht',
            isCorrect: false,
          },
          {
            answerText: 'Du bist der Busfahrer',
            isCorrect: true,
          },
          {
            answerText: 'über 90, er hat den Führerschein in seinen jungen Jahren gemacht',
            isCorrect: false
          },
        ],
        nextQuestionId: 5,
      },
      {
        id: 5,
        questionNumber: 5,
        questionText: 'Wie heißt Pippi Langstrumpfs Affe?',
        previewTime: 5,
        answerTimeInSeconds: 15,
        answers: [
          {
            answerText: 'Herr Peterson',
            isCorrect: false,
          },
          {
            answerText: 'Nils Holgerson',
            isCorrect: false,
          },
          {
            answerText: 'Herr Nilsson',
            isCorrect: true,
          },
        ],
        nextQuestionId: null,
        imageName: 'assets/images/herr-nilsson.jpg'
      },
    ]
  };

  static gamePins: number[] = [];

  constructor(private httpClient: HttpClient) { }

  getQuestionByIdAllInfo(id: number): Observable<Question> {
    return this.httpClient.get<Question>(`${RestService.url}quizzes/1/questions/${id}`);
  }

  getQuestionById(id: number): Question | undefined {
    return this.demoQuiz.questions.find(question => question.id == id);
  }

  getQuestionByQuestionNumber(questionNumber: number, username: string): Observable<StudentViewData> {
    return this.httpClient.get<StudentViewData>(`${RestService.url}quizzes/1/questions/${questionNumber}/mobile?username=${username}`);
  };
  getQuiz(): Quiz {
    return this.demoQuiz;
  }
  
  getQuizLength(): number {
    return this.demoQuiz.questions.length;
  }

  getAnswerCountOfQuestion(id: number): number {
    return this.getQuestionById(id)!.answers.length;
  }

  areAnswersCorrect(questionNumber: number, buttons: boolean[]): Observable<boolean> {
    return this.httpClient.post<boolean>(`${RestService.url}quizzes/1/questions/${questionNumber}/correct`, buttons);  
  }

  getNextQuestionId(currentQuestionId: number): number | undefined | null {
    const question: Question | undefined = this.getQuestionById(currentQuestionId);
    if (typeof question === 'undefined') {
      return undefined;
    } else {
      return question.nextQuestionId;
    }
  }

  addGamePin(gamePin: number): void {
    RestService.gamePins.push(gamePin);
  }

  gamePinExists(gamePin: number): boolean {
    const exists: number | undefined = RestService.gamePins.find(gamePin => gamePin == gamePin);
    return typeof exists !== 'undefined';
  }
}
