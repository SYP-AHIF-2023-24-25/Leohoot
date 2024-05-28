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
import { environment } from 'src/environments/environment.development';
import { AuthResponse } from '../model/auth-response';
import { User } from '../model/user';
import { Tag } from '../model/tag';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  public static apiUrl: string = `${environment.apiUrl}/api/`;
  public static cdnUrl: string = `${environment.cdnUrl}/cdn/`;
  
  constructor(private httpClient: HttpClient) { }

  getQuestionTeacher(gameId: number): Observable<QuestionTeacher> {
    return this.httpClient.get<QuestionTeacher>(`${RestService.apiUrl}games/${gameId}/currentQuestion/teacher`);
  }

  getQuestionStudent(gameId: number, username: string): Observable<QuestionStudent> {
    return this.httpClient.get<QuestionStudent>(`${RestService.apiUrl}games/${gameId}/currentQuestion/student?username=${username}`);
  };

  addAnswer(gameId: number, buttons: boolean[], username: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${RestService.apiUrl}games/${gameId}/answers`, {answers: buttons, username: username});
  }

  getRanking(gameId: number): Observable<Ranking> {
    return this.httpClient.get<Ranking>(`${RestService.apiUrl}games/${gameId}/ranking`);
  }

  getGameStatistics(gameId: number): Observable<Statistic> {
    return this.httpClient.get<Statistic>(`${RestService.apiUrl}games/${gameId}/statistic`);
  }

  getNewGameId(quizId: number): Observable<number> {
    return this.httpClient.post<number>(`${RestService.apiUrl}games/${quizId}`, {});
  }

  getQuizIdByGameId(gameId: number): Observable<number> {
    return this.httpClient.get<number>(`${RestService.apiUrl}games/${gameId}/quiz`);
  }


  nextQuestion(gameId: number): Observable<QuestionTeacher> {
    return this.httpClient.put<QuestionTeacher>(`${RestService.apiUrl}games/${gameId}/currentQuestion`, {});
  }

  doesGameExist(gameId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${RestService.apiUrl}games/${gameId}/exists`);
  }

  addQuiz(quiz: Quiz): Observable<number> {
    return this.httpClient.post<number>(`${RestService.apiUrl}quizzes`, quiz);
  }

  updateQuiz(id: number, quiz: Quiz): Observable<void> {
    return this.httpClient.put<void>(`${RestService.apiUrl}quizzes/${id}`, quiz);
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.httpClient.get<Quiz>(`${RestService.apiUrl}quizzes/${id}`);
  }

  deleteGame(gameId: number): Observable<void> {
    return this.httpClient.delete<void>(`${RestService.apiUrl}games/${gameId}`);
  }

  deleteQuiz(quizId: number): Observable<void> {
    return this.httpClient.delete<void>(`${RestService.apiUrl}quizzes/${quizId}`);
  }

  getAllQuizzes(): Observable<Quiz[]> {
    return this.httpClient.get<Quiz[]>(`${RestService.apiUrl}quizzes`);
  }

  addImage(image: FormData): Observable<string> {
    return this.httpClient.post<string>(`${RestService.apiUrl}quizzes/upload/images`, image);
  }
  getImage(imageName: string): string {
    return `${RestService.cdnUrl}images/${imageName}`;
  }

  getAllTags(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(`${RestService.apiUrl}quizzes/tags`);
  }

  getTagByName(name: string): Observable<Tag> {
    return this.httpClient.get<Tag>(`${RestService.apiUrl}quizzes/tags/${name}`);
  }

  addTag(tag: Tag): Observable<void> {
    return this.httpClient.post<void>(`${RestService.apiUrl}quizzes/tags`, tag);
  }

  deleteTag(name: string): Observable<void> {
    return this.httpClient.delete<void>(`${RestService.apiUrl}quizzes/tags/${name}`);
  }

  getTagsByQuizId(quizId: number): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(`${RestService.apiUrl}quizzes/${quizId}/tags`);
  }

  addTagToQuiz(quizId: number, tagName: string): Observable<void> {
    return this.httpClient.post<void>(`${RestService.apiUrl}quizzes/${quizId}/tags/`, tagName);
  }

  removeTagFromQuiz(quizId: number, tagName: string): Observable<void> {
    return this.httpClient.delete<void>(`${RestService.apiUrl}quizzes/${quizId}/tags/${tagName}`);
  }

  signup(username: string, password: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${RestService.apiUrl}users`, {username: username, password: password});
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.httpClient.put<AuthResponse>(`${RestService.apiUrl}users/login`, {username: username, password: password});
  }

  getUser(username: string): Observable<User> {
    return this.httpClient.get<User>(`${RestService.apiUrl}users/${username}`);
  }
}
