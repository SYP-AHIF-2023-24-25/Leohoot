import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from "ng-apexcharts";

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
import { EndStatisticsComponent } from './components/end-statistics/end-statistics.component';

@NgModule({
  declarations: [AppComponent, WaitingroomComponent, RankingComponent, StudentsMobileViewComponent, QuestionComponent, StudentsMobileRankingComponent, StudentsLoadingScreenComponent, GameLoginComponent, GameUserLoginComponent, StudentWaitingPageComponent, EndStatisticsComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, QRCodeModule, NgxQrcodeStylingModule, HttpClientModule, NgApexchartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
