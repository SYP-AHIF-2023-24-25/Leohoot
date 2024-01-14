import { Injectable } from '@angular/core';
import { Quiz } from '../model/quiz';
import { Question } from '../model/question';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  demoQuiz: Quiz = {
    title: 'Demo Quiz',
    description: 'This is a demo quiz',
    creator: 'Hooti',
    questions: [
      {
        id: 1,
        question: 'What is the capital of France?',
        answerTimeInSeconds: 15,
        answers: [
          {
            answer: 'Lyon',
            isCorrect: false,
          },
          {
            answer: 'Paris',
            isCorrect: true,
          },
          {
            answer: 'Marseille',
            isCorrect: false,
          },
          {
            answer: 'St. Tropez',
            isCorrect: false,
          },
        ],
        imageName: 'assets/images/panorama.jpg',
        nextQuestionId: 2,
      },
      {
        id: 2,
        question: 'Is Syp cool?',
        answerTimeInSeconds: 10,
        answers: [
          {
            answer: 'true',
            isCorrect: true,
          },
          {
            answer: 'false',
            isCorrect: false,
          },
        ],
        nextQuestionId: 3,
      },
      {
        id: 3,
        question: 'Which animals are in our mascot?',
        answerTimeInSeconds: 20,
        answers: [
          {
            answer: 'Lion',
            isCorrect: true,
          },
          {
            answer: 'Chicken',
            isCorrect: false,
          },
          {
            answer: 'Cat',
            isCorrect: false,
          },
          {
            answer: 'Owl',
            isCorrect: true,
          },
        ],
        nextQuestionId: 4,
      },
      {
        id: 4,
        question: 'Du bist Busfahrer. An der 1. Haltestelle steigen 5 Gäste ein. An der 2. Haltestelle steigen 3 Leute zu und 2 aus. An der 3. Haltestelle steigen 4 ein und 5 aus. Wie alt ist der Busfahrer?',
        answerTimeInSeconds: 30,
        answers: [
          {
            answer: '18, er ist Fahranfänger',
            isCorrect: false,
          },
          {
            answer: 'Der Busfahrer existiert gar nicht',
            isCorrect: false,
          },
          {
            answer: 'Du bist der Busfahrer',
            isCorrect: true,
          },
          {
            answer: 'über 90, er hat den Führerschein in seinen jungen Jahren gemacht',
            isCorrect: false,
          },
        ],
        nextQuestionId: 5,
      },
      {
        id: 5,
        question: 'Wie heißt Pippi Langstrumpfs Affe?',
        answerTimeInSeconds: 15,
        answers: [
          {
            answer: 'Herr Peterson',
            isCorrect: false,
          },
          {
            answer: 'Nils Holgerson',
            isCorrect: false,
          },
          {
            answer: 'Herr Nilsson',
            isCorrect: true,
          },
        ],
        nextQuestionId: null
      },
    ]
  };

  static gamePins: number[] = [];

  currentQuestionId: number = 1;

  constructor() { }

  getQuestionById(id: number): Question | undefined {
    return this.demoQuiz.questions.find(question => question.id == id);
  }

  getQuiz(): Quiz {
    return this.demoQuiz;
  }
  
  getQuizLength(): number {
    return this.demoQuiz.questions.length;
  }

  getAnswerCountOfQuestion(id: number): number {
    return this.getQuestionById(id)!.answers.length;
  }

  areAnswersCorrect(questionId: number, buttons: boolean[]): boolean {
    let areAnswersCorrect: boolean = true;
    const question: Question | undefined = this.getQuestionById(questionId);
    if (typeof question === 'undefined') {
      areAnswersCorrect =  false;
    } else {
      for (let i = 0; i < question.answers.length && areAnswersCorrect; i++) {
        if (question.answers[i].isCorrect != buttons[i]) {
          areAnswersCorrect =  false;
        }
      }
    }
    return areAnswersCorrect;
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
    console.log(RestService.gamePins);
  }

  gamePinExists(gamePin: number): boolean {
    const exists: number | undefined = RestService.gamePins.find(gamePin => gamePin == gamePin);
    return typeof exists !== 'undefined';
  }
}
