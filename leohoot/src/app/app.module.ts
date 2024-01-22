import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherDemoModeQuizComponent } from './components/teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';
import { WaitingroomComponent } from './components/waitingroom/waitingroom.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { QuestionComponent } from './components/question/question.component';
import { StudentsMobileViewComponent } from './components/students-mobile-view/students-mobile-view.component';
import { StudentsMobileRankingComponent } from './components/students-mobile-ranking/students-mobile-ranking.component';
import { GameTeacherViewComponent } from './components/game-teacher-view/game-teacher-view.component';
import { StudentsLoadingScreenComponent } from './components/students-loading-screen/students-loading-screen.component';
import { GameLoginComponent } from './components/game-pin-login/game-pin-login.component';
import { GameUserLoginComponent } from './components/game-user-login/game-user-login.component';
import { StudentWaitingPageComponent } from './components/students-waiting-page/students-waiting-page.component';
import { HttpClient } from '@microsoft/signalr';

@NgModule({
  declarations: [AppComponent, TeacherDemoModeQuizComponent, WaitingroomComponent, RankingComponent, StudentsMobileViewComponent, QuestionComponent, StudentsMobileRankingComponent, GameTeacherViewComponent, StudentsLoadingScreenComponent, GameLoginComponent, GameUserLoginComponent, StudentWaitingPageComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, QRCodeModule, NgxQrcodeStylingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
