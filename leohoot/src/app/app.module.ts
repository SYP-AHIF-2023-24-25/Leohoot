import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from "ng-apexcharts";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxCaptureModule } from "ngx-capture";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WaitingroomComponent } from './screens/teacher-screens/waitingroom/waitingroom.component';
import { RankingComponent } from './screens/teacher-screens/ranking/ranking.component';
import { QuestionComponent } from './screens/teacher-screens/question/question.component';
import { AnswerViewComponent } from './screens/student-screens/answer-view/answer-view.component';
import { InterimResultRankingComponent } from './screens/student-screens/interim-result-view/interim-result-ranking.component';
import { LoadingScreenComponent } from './screens/student-screens/loading-screen/loading-screen.component';
import { GameLoginComponent } from './screens/student-screens/game-login/game-login.component';
import { GameUserLoginComponent } from './screens/student-screens/game-user-login/game-user-login.component';
import { WaitingPageComponent } from './screens/student-screens/waiting-page/waiting-page.component';
import { QuizMakerComponent } from './screens/teacher-screens/quiz-maker/quiz-maker.component';
import { QuizMakerQuestionsComponent } from './components/quiz-maker/quiz-maker-questions/quiz-maker-questions.component';
import { QuizMakerSidebarComponent } from './components/quiz-maker/quiz-maker-sidebar/quiz-maker-sidebar.component';
import { QuizMakerSidebarItemComponent } from './components/quiz-maker/quiz-maker-sidebar-item/quiz-maker-sidebar-item.component';
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { StatisticComponent } from './screens/teacher-screens/statistic/statistic.component';
import { QuizOverviewComponent } from './screens/teacher-screens/quiz-overview/quiz-overview.component';
import { QuestionPreviewComponent } from './screens/teacher-screens/question-preview/question-preview.component';
import { appConfig } from './app.config';
import { LoginViewComponent } from './screens/teacher-screens/login-view/login-view.component';
import { SignupViewComponent } from './screens/teacher-screens/signup-view/signup-view.component';
import { ValidatePasswordDirective } from './validatiors/validate-password.directive';
import { LoginOptionsComponent } from './screens/teacher-screens/login-options/login-options.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameInfosComponent } from "./components/waitingroom/game-infos/game-infos.component";
import { TopThreeComponent } from "./components/statistics/top-three/top-three.component";
import { HeaderComponent } from "./components/general-components/header/header.component";
import { StatisticOverviewComponent } from "./components/statistics/statistic-overview/statistic-overview.component";
import { ButtonComponent } from "./components/general-components/button/button.component";

@NgModule({
  declarations: [
    AppComponent,
    WaitingroomComponent,
    RankingComponent,
    AnswerViewComponent,
    QuestionComponent,
    InterimResultRankingComponent,
    LoadingScreenComponent,
    GameLoginComponent,
    GameUserLoginComponent,
    WaitingPageComponent,
    QuizMakerComponent,
    StatisticComponent,
    QuestionPreviewComponent,
    QuizOverviewComponent,
    QuizMakerQuestionsComponent,
    QuizMakerSidebarComponent,
    QuizMakerSidebarItemComponent,
    LoginViewComponent,
    SignupViewComponent,
    ValidatePasswordDirective,
    LoginOptionsComponent,
    GameInfosComponent,
    TopThreeComponent,
    HeaderComponent,
    StatisticOverviewComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    QRCodeModule,
    NgxQrcodeStylingModule,
    HttpClientModule,
    NgApexchartsModule,
    CommonModule,
    DragDropModule,
    NgxCaptureModule,
    MatCheckboxModule,
    MatSelectModule,
    BrowserAnimationsModule,
    NgOptimizedImage,
  ],
  providers: [...appConfig.providers, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
