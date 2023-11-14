import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';
import { WaitingroomComponent } from './waitingroom/waitingroom.component';
import { RankingComponent } from './ranking/ranking.component';
import { QuestionComponent } from './question/question.component';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [AppComponent, TeacherDemoModeQuizComponent, WaitingroomComponent, RankingComponent, QuestionComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, QRCodeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
