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

  constructor(private httpClient: HttpClient) { }

  getQuestionByIdAllInfo(id: number): Observable<Question> {
    return this.httpClient.get<Question>(`${RestService.url}quizzes/1/questions/${id}`);
  }

  getQuestionByQuestionNumber(questionNumber: number, username: string): Observable<StudentViewData> {
    return this.httpClient.get<StudentViewData>(`${RestService.url}quizzes/1/questions/${questionNumber}/mobile?username=${username}`);
  };

  getQuizLengthById(id: number): Observable<number> {
    return this.httpClient.get<number>(`${RestService.url}quizzes/${id}/length`);
  }

  getQuizById(quizId: number): Observable<Quiz> {
    return this.httpClient.get<Quiz>(`${RestService.url}quizzes/${quizId}`);
  }

  areAnswersCorrect(questionNumber: number, buttons: boolean[]): Observable<boolean> {
    return this.httpClient.post<boolean>(`${RestService.url}quizzes/1/questions/${questionNumber}/correct`, buttons);  
  }
}
