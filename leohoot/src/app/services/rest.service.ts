import { Injectable } from '@angular/core';
import { DemoQuiz } from 'src/model/demo-quiz';
import { Question } from 'src/model/question';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  demoQuiz: DemoQuiz = {
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
        ]
      },
    ]
  };

  constructor() { }

  getQuestionById(id: number): Question | undefined {
    return this.demoQuiz.questions.find(question => question.id == id);
  }
}
