import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AnswerViewComponent} from "./screens/student-screens/answer-view/answer-view.component";
import {RankingComponent} from './screens/teacher-screens/ranking/ranking.component';
import {QuestionComponent} from './screens/teacher-screens/question/question.component';
import {WaitingroomComponent} from './screens/teacher-screens/waitingroom/waitingroom.component';
import {
  InterimResultRankingComponent
} from "./screens/student-screens/interim-result-view/interim-result-ranking.component";
import {GameLoadingScreen} from './screens/student-screens/game-loading-screen/game-loading-screen.component'
import {GameLoginComponent} from './screens/student-screens/game-login/game-login.component';
import {GameUserLoginComponent} from './screens/student-screens/game-user-login/game-user-login.component';
import {
  WaitingPageComponent
} from './screens/student-screens/waiting-page/waiting-page.component';
import {QuizMakerComponent} from './screens/teacher-screens/quiz-maker/quiz-maker.component';
import {StatisticComponent} from './screens/teacher-screens/statistic/statistic.component';
import {QuizOverviewComponent} from './screens/teacher-screens/quiz-overview/quiz-overview.component';
import {QuestionPreviewComponent} from './screens/teacher-screens/question-preview/question-preview.component';
import { QuizMakerQuestionsComponent } from './components/quiz-maker/quiz-maker-questions/quiz-maker-questions.component';
import { AuthGuard } from './model/auth-guard';
import { Role } from './model/leo-token';
import {DashboardComponent} from "./components/teacher-components/dashboard/dashboard.component";
import { ResultViewComponent } from './screens/student-screens/result-view/result-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/quizOverview', pathMatch: 'full' },
  { path: 'answerView', component: AnswerViewComponent },
  { path: 'interimResult', component: InterimResultRankingComponent },
  {path:'dashboard', component: DashboardComponent},
  {
    path: 'ranking',
    component: RankingComponent,
    canActivate: [AuthGuard], data: {
      roles: [Role.Teacher]
    }
  },
  {
    path: 'question',
    component: QuestionComponent,
    canActivate: [AuthGuard], data: {
      roles: [Role.Teacher]
    }
  },
  {
    path: 'waitingroom',
    component: WaitingroomComponent,
    canActivate: [AuthGuard], data: {
      roles: [Role.Teacher]
    }
  },
  { path: 'gameLogin', component: GameLoginComponent },
  { path: 'gameUserLogin', component: GameUserLoginComponent },
  { path: 'waitingPage', component: WaitingPageComponent } ,
  {
    path: 'statistic',
    component: StatisticComponent,
    canActivate: [AuthGuard], data: {
      roles: [Role.Teacher]
    }
  },
  {
    path: 'quizMaker',
    component: QuizMakerComponent,
    canActivate: [AuthGuard], data: {
      roles: [Role.Teacher]
    }
  },
  {
    path: 'quizMakerQuestions',
    component: QuizMakerQuestionsComponent,
    canActivate: [AuthGuard], data: {
      roles: [Role.Teacher]
    }
  },
  {
    path: 'quizOverview',
    component: QuizOverviewComponent,
    canActivate: [AuthGuard], data: {
      roles: [Role.Teacher]
    }
  },
  {
    path: 'questionPreview',
    component: QuestionPreviewComponent,
    canActivate: [AuthGuard], data: {
      roles: [Role.Teacher]
    }
  },
  {
    path: 'loadingScreen',
    component: GameLoadingScreen
  },
  {
    path: 'resultView',
    component: ResultViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
