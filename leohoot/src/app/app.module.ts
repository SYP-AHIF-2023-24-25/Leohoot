import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';
import { WaitingroomComponent } from './waitingroom/waitingroom.component';
import { RankingComponent } from './ranking/ranking.component';
import { QuestionComponent } from './question/question.component';
import { StudentsMobileViewComponent } from './students-mobile-view/students-mobile-view.component';
import { StudentsMobileRankingComponent } from './students-mobile-ranking/students-mobile-ranking.component';
import { GameTeacherViewComponent } from './game-teacher-view/game-teacher-view.component';
import { StudentsLoadingScreenComponent } from './students-loading-screen/students-loading-screen.component';
import { GameLoginComponent } from './game-pin-login/game-pin-login.component';
import { GameUserLoginComponent } from './game-user-login/game-user-login.component';
import { StudentWaitingPageComponent } from './students-waiting-page/students-waiting-page.component';

@NgModule({
  declarations: [AppComponent, TeacherDemoModeQuizComponent, WaitingroomComponent, RankingComponent, StudentsMobileViewComponent, QuestionComponent, StudentsMobileRankingComponent, GameTeacherViewComponent, StudentsLoadingScreenComponent, GameLoginComponent, GameUserLoginComponent, StudentWaitingPageComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, QRCodeModule, NgxQrcodeStylingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
