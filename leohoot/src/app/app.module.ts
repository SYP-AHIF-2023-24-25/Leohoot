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
import { WaitingroomComponent } from './components/teacher-components/waitingroom/waitingroom.component';
import { RankingComponent } from './components/teacher-components/ranking/ranking.component';
import { QuestionComponent } from './components/teacher-components/question/question.component';
import { AnswerViewComponent } from './components/student-components/answer-view/answer-view.component';
import { InterimResultRankingComponent } from './components/student-components/interim-result-view/interim-result-ranking.component';
import { LoadingScreenComponent } from './components/student-components/loading-screen/loading-screen.component';
import { GameLoginComponent } from './components/student-components/game-login/game-login.component';
import { GameUserLoginComponent } from './components/student-components/game-user-login/game-user-login.component';
import { WaitingPageComponent } from './components/student-components/waiting-page/waiting-page.component';
import { QuizMakerComponent } from './components/teacher-components/quiz-maker/quiz-maker.component';
import { QuizMakerQuestionsComponent } from './components/teacher-components/quiz-maker-questions/quiz-maker-questions.component';
import { QuizMakerSidebarComponent } from './components/teacher-components/quiz-maker-sidebar/quiz-maker-sidebar.component';
import { QuizMakerSidebarItemComponent } from './components/teacher-components/quiz-maker-sidebar-item/quiz-maker-sidebar-item.component';
import { CommonModule } from '@angular/common';
import { StatisticComponent } from './components/teacher-components/statistic/statistic.component';
import { QuizOverviewComponent } from './components/teacher-components/quiz-overview/quiz-overview.component';
import { QuestionPreviewComponent } from './components/teacher-components/question-preview/question-preview.component';
import { appConfig } from './app.config';
import { LoginViewComponent } from './components/teacher-components/login-view/login-view.component';
import { SignupViewComponent } from './components/teacher-components/signup-view/signup-view.component';
import { ValidatePasswordDirective } from './validatiors/validate-password.directive';
import { LoginOptionsComponent } from './components/teacher-components/login-options/login-options.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: 
    [
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
        LoginOptionsComponent
    ],
    imports: 
    [
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
        BrowserAnimationsModule
    ],
    providers: [
        ...appConfig.providers,
        provideAnimationsAsync(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
