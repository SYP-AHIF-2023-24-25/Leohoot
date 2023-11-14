import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';
import { StudentsMobileViewComponent } from './students-mobile-view/students-mobile-view.component';
import { RankingComponent } from './ranking/ranking.component';
import { QuestionComponent } from './question/question.component';

@NgModule({
  declarations: [AppComponent, TeacherDemoModeQuizComponent, RankingComponent, StudentsMobileViewComponent, QuestionComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
