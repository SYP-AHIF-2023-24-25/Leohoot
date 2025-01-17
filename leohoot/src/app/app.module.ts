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
import { GameLoadingScreen } from './screens/student-screens/game-loading-screen/game-loading-screen.component';
import { GameLoginComponent } from './screens/student-screens/game-login/game-login.component';
import { GameUserLoginComponent } from './screens/student-screens/game-user-login/game-user-login.component';
import { WaitingPageComponent } from './screens/student-screens/waiting-page/waiting-page.component';
import { QuizMakerComponent } from './screens/teacher-screens/quiz-maker/quiz-maker.component';
import { QuizMakerQuestionsComponent } from './components/quiz-maker/quiz-maker-questions/quiz-maker-questions.component';
import { QuizMakerSidebarComponent } from './components/quiz-maker/quiz-maker-sidebar/quiz-maker-sidebar.component';
import { QuizMakerSidebarItemComponent } from './components/quiz-maker/quiz-maker-sidebar-item/quiz-maker-sidebar-item.component';
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { StatisticComponent } from './screens/teacher-screens/statistic/statistic.component';
import { QuestionPreviewComponent } from './screens/teacher-screens/question-preview/question-preview.component';
import { appConfig } from './app.config';
import { ValidatePasswordDirective } from './validatiors/validate-password.directive';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameInfosComponent } from "./components/waitingroom/game-infos/game-infos.component";
import { TopThreeComponent } from "./components/statistics/top-three/top-three.component";
import { HeaderComponent } from "./components/general-components/header/header.component";
import { ButtonComponent } from "./components/general-components/button/button.component";
import { RankingListComponent } from "./components/ranking/ranking-list/ranking-list.component";
import { FooterComponent } from "./components/general-components/footer/footer.component";
import { QuizCardComponent } from "./components/quiz-overview/quiz-card/quiz-card.component";
import { SearchBarComponent } from "./components/quiz-overview/search-bar/search-bar.component";
import { NavbarComponent } from "./components/general-components/navbar/navbar.component";
import { CountdownComponent } from "./components/general-components/countdown/countdown.component";
import { AnswerButtonComponent } from "./components/question/answer-button/answer-button.component";
import { OptionalImageComponent } from "./components/question/optional-image/optional-image.component";
import { FooterStudentComponent } from "./components/general-components/footer-student/footer-student.component";
import { LoadingScreenComponent } from "./components/general-components/loading-screen/loading-screen.component";
import { UserCardComponent } from './components/waitingroom/user-card/user-card.component';
import { ResultViewComponent } from './screens/student-screens/result-view/result-view.component';
import { HeaderStudentComponent } from "./components/general-components/header-student/header-student.component";
import { QuizDetailPageComponent } from "./screens/teacher-screens/quiz-detail-page/quiz-detail-page.component";
import { HeaderDetailsComponent } from "./components/quiz-detail-page/header-details/header-details.component";
import { QuizDetailsComponent } from "./components/quiz-detail-page/quiz-details/quiz-details.component";
import { QuestionsComponent } from "./components/quiz-detail-page/questions/questions.component";
import { SidebarComponent } from './components/general-components/sidebar/sidebar.component';
import { DashboardComponent } from './screens/teacher-screens/dashboard/dashboard.component';
import { StatisticOverviewComponent } from "./screens/teacher-screens/statistic-overview/statistic-overview.component";
import { ProfileComponent } from "./components/general-components/profile/profile.component";
import { StudentStatisticComponent } from "./screens/teacher-screens/student-statistic/student-statistic.component";
import { GameStatisticComponent } from "./screens/teacher-screens/game-statistics/game-statistic.component";
import { StatisticTableComponent } from "./components/statistics/statistic-table/statistic-table.component";
import { DateRangeFilterComponent } from "./components/statistics/date-range-filter/date-range-filter.component";

@NgModule({
  declarations: [
    AppComponent,
    WaitingroomComponent,
    RankingComponent,
    AnswerViewComponent,
    QuestionComponent,
    InterimResultRankingComponent,
    GameLoadingScreen,
    GameLoginComponent,
    GameUserLoginComponent,
    WaitingPageComponent,
    QuizMakerComponent,
    StatisticComponent,
    QuestionPreviewComponent,
    QuizMakerQuestionsComponent,
    QuizMakerSidebarComponent,
    QuizMakerSidebarItemComponent,
    ValidatePasswordDirective,
    GameInfosComponent,
    TopThreeComponent,
    HeaderComponent,
    StatisticOverviewComponent,
    ButtonComponent,
    RankingListComponent,
    FooterComponent,
    QuizCardComponent,
    SearchBarComponent,
    NavbarComponent,
    CountdownComponent,
    AnswerButtonComponent,
    OptionalImageComponent,
    FooterStudentComponent,
    UserCardComponent,
    ResultViewComponent,
    HeaderStudentComponent,
    QuizDetailPageComponent,
    HeaderDetailsComponent,
    QuizDetailsComponent,
    QuestionsComponent,
    SidebarComponent,
    DashboardComponent,
    StatisticOverviewComponent,
    ProfileComponent,
    GameStatisticComponent,
    StudentStatisticComponent,
    StatisticTableComponent,
    DateRangeFilterComponent
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
    LoadingScreenComponent,
    CommonModule
],
  providers: [...appConfig.providers, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
