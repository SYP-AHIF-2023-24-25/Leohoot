import { Injectable } from '@angular/core';
import { Quiz } from '../model/quiz';
import { QuestionTeacher } from '../model/question-teacher';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionComponent } from '../components/teacher-components/question/question.component';
import { QuestionStudent } from '../model/question-student';
import { Player } from '../model/player';
import { Statistic } from '../model/statistic';
import { Ranking } from '../model/ranking';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  public static url: string = 'http://localhost:5000/api/';
  //public static url: string = 'http://140.238.173.82:8001/api/'

  constructor(private httpClient: HttpClient) { }

  getQuestionTeacher(gameId: number): Observable<QuestionTeacher> {
    return this.httpClient.get<QuestionTeacher>(`${RestService.url}games/${gameId}/currentQuestion/teacher`);
  }

  getQuestionStudent(gameId: number, username: string): Observable<QuestionStudent> {
    return this.httpClient.get<QuestionStudent>(`${RestService.url}games/${gameId}/currentQuestion/student?username=${username}`);
  };

  addAnswer(gameId: number, buttons: boolean[], username: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${RestService.url}games/${gameId}/answers`, {answers: buttons, username: username});
  }

  getRanking(gameId: number): Observable<Ranking> {
    return this.httpClient.get<Ranking>(`${RestService.url}games/${gameId}/ranking`);
  }

  getGameStatistics(gameId: number): Observable<Statistic> {
    return this.httpClient.get<Statistic>(`${RestService.url}games/${gameId}/statistic`);
  }

  getNewGameId(quizId: number): Observable<number> {
    return this.httpClient.post<number>(`${RestService.url}games/${quizId}`, {});
  }

  getQuizIdByGameId(gameId: number): Observable<number> {
    return this.httpClient.get<number>(`${RestService.url}games/${gameId}/quiz`);
  }


  nextQuestion(gameId: number): Observable<QuestionTeacher> {
    return this.httpClient.put<QuestionTeacher>(`${RestService.url}games/${gameId}/currentQuestion`, {});
  }

  doesGameExist(gameId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${RestService.url}games/${gameId}/exists`);
  }

  addQuiz(quiz: Quiz): Observable<number> {
    return this.httpClient.post<number>(`${RestService.url}quizzes`, quiz);
  }

  updateQuiz(id: number, quiz: Quiz): Observable<void> {
    return this.httpClient.put<void>(`${RestService.url}quiz/${id}`, quiz);
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.httpClient.get<Quiz>(`${RestService.url}quizzes/${id}`);
  }

  deleteGame(gameId: number): Observable<void> {
    return this.httpClient.delete<void>(`${RestService.url}games/${gameId}`);
  }

  getAllQuizzes(): Observable<Quiz[]> {
    return this.httpClient.get<Quiz[]>(`${RestService.url}quizzes`);
  }
}
