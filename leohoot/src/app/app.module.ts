import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';
import { StudentsMobileViewComponent } from './students-mobile-view/students-mobile-view.component';
import { RankingComponent } from './ranking/ranking.component';
import { QuestionComponent } from './question/question.component';
import { StudentsMobileRankingComponent } from './students-mobile-ranking/students-mobile-ranking.component';
import { GameTeacherViewComponent } from './game-teacher-view/game-teacher-view.component';
import { StudentsLoadingScreenComponent } from './students-loading-screen/students-loading-screen.component';

@NgModule({
  declarations: [AppComponent, TeacherDemoModeQuizComponent, RankingComponent, StudentsMobileViewComponent, QuestionComponent, StudentsMobileRankingComponent, GameTeacherViewComponent, StudentsLoadingScreenComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
