import { Injectable } from '@angular/core';
import { Quiz } from '../model/quiz';
import { Question } from '../model/question';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionComponent } from '../components/question/question.component';
import { StudentViewData } from '../model/student-view-data';
import { Player } from '../model/player';
import { Statistic } from '../model/statistic';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  //public static url: string = 'http://localhost:5000/api/';
  public static url: string = 'http://140.238.173.82:8001/api/'

  constructor(private httpClient: HttpClient) { }

  getQuestionByIdAllInfo(quizId: number, questionNumber: number): Observable<Question> {
    return this.httpClient.get<Question>(`${RestService.url}quizzes/${quizId}/questions/${questionNumber}`);
  }

  getQuestionByQuestionNumber(quizId: number, questionNumber: number, username: string): Observable<StudentViewData> {
    return this.httpClient.get<StudentViewData>(`${RestService.url}quizzes/${quizId}/questions/${questionNumber}/mobile?username=${username}`);
  };

  getAllQuizzes(): Observable<Quiz[]> {
    return this.httpClient.get<Quiz[]>(`${RestService.url}quizzes`);
  }

  getQuizLengthById(id: number): Observable<number> {
    return this.httpClient.get<number>(`${RestService.url}quizzes/${id}/length`);
  }

  getQuizById(quizId: number): Observable<Quiz> {
    return this.httpClient.get<Quiz>(`${RestService.url}quizzes/${quizId}`);
  }

  addAnswer(quizId: number, questionNumber: number, buttons: boolean[], username: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${RestService.url}quizzes/${quizId}/questions/${questionNumber}?username=${username}`, buttons);
  }

  getRanking(quizId: number, questionNumber: number): Observable<Player[]> {
    return this.httpClient.get<Player[]>(`${RestService.url}quizzes/ranking`);
  }

  getGameStatistics(quizId: number): Observable<Statistic> {
    return this.httpClient.get<Statistic>(`${RestService.url}quizzes/${quizId}/statistic`);
  }

  resetGame(): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${RestService.url}users/reset`);
  }
}
