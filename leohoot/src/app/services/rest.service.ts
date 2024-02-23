import { Injectable } from '@angular/core';
import { Quiz } from '../model/quiz';
import { Question } from '../model/question';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionComponent } from '../components/question/question.component';
import { StudentViewData } from '../model/student-view-data';
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

  getQuestionTeacher(gameId: number): Observable<Question> {
    return this.httpClient.get<Question>(`${RestService.url}games/${gameId}/currentQuestion/teacher`);
  }

  getQuestionStudent(gameId: number, username: string): Observable<StudentViewData> {
    return this.httpClient.get<StudentViewData>(`${RestService.url}games/${gameId}/currentQuestion/student?username=${username}`);
  };

  getQuizLengthById(id: number): Observable<number> {
    return this.httpClient.get<number>(`${RestService.url}quizzes/${id}/length`);
  }

  getQuizById(quizId: number): Observable<Quiz> {
    return this.httpClient.get<Quiz>(`${RestService.url}quizzes/${quizId}`);
  }

  addAnswer(gameId: number, buttons: boolean[], username: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${RestService.url}games/${gameId}/answers`, {answers: buttons, username: username});  
  }

  getRanking(gameId: number): Observable<Ranking> {
    return this.httpClient.get<Ranking>(`${RestService.url}games/${gameId}/ranking`);
  }

  getGameStatistics(gameId: number): Observable<Statistic> {
    return this.httpClient.get<Statistic>(`${RestService.url}games/${gameId}/statistic`);
  }

  resetGame(): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${RestService.url}users/reset`);
  }

  getNewGameId(quizId: number): Observable<number> {
    return this.httpClient.post<number>(`${RestService.url}games/${quizId}`, {});
  }

  nextQuestion(gameId: number): Observable<Question> {
    return this.httpClient.put<Question>(`${RestService.url}games/${gameId}/currentQuestion`, {});
  }
}
