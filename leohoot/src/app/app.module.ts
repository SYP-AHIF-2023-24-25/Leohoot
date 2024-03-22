import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from "ng-apexcharts";
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WaitingroomComponent } from './components/waitingroom/waitingroom.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { QuestionComponent } from './components/question/question.component';
import { StudentsMobileViewComponent } from './components/students-mobile-view/students-mobile-view.component';
import { StudentsMobileRankingComponent } from './components/students-mobile-ranking/students-mobile-ranking.component';
import { StudentsLoadingScreenComponent } from './components/students-loading-screen/students-loading-screen.component';
import { GameLoginComponent } from './components/game-pin-login/game-pin-login.component';
import { GameUserLoginComponent } from './components/game-user-login/game-user-login.component';
import { StudentWaitingPageComponent } from './components/students-waiting-page/students-waiting-page.component';
import { QuizMakerComponent } from './components/quiz-maker/quiz-maker.component';
import { DesignQuestionComponent } from './components/design-question/design-question.component';
import { CommonModule } from '@angular/common';
import { StatisticComponent } from './components/statistic/statistic.component';
import { GamesComponent } from './components/games/games.component';
import { QuestionPreviewComponent } from './components/question-preview/question-preview.component';
import { QuestionNavbarComponent } from './components/question-navbar/question-navbar.component';

@NgModule({
    declarations: [AppComponent, WaitingroomComponent, RankingComponent, StudentsMobileViewComponent, QuestionComponent, StudentsMobileRankingComponent, StudentsLoadingScreenComponent, GameLoginComponent, GameUserLoginComponent, StudentWaitingPageComponent, QuizMakerComponent, DesignQuestionComponent, StatisticComponent, QuestionPreviewComponent, GamesComponent, QuestionNavbarComponent],
    imports: [BrowserModule, AppRoutingModule, FormsModule, QRCodeModule, NgxQrcodeStylingModule, HttpClientModule, NgApexchartsModule, CommonModule, DragDropModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
