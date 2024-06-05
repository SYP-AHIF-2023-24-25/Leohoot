import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AnswerViewComponent} from "./components/student-components/answer-view/answer-view.component";
import {RankingComponent} from './components/teacher-components/ranking/ranking.component';
import {QuestionComponent} from './components/teacher-components/question/question.component';
import {WaitingroomComponent} from './components/teacher-components/waitingroom/waitingroom.component';
import {
  InterimResultRankingComponent
} from "./components/student-components/interim-result-view/interim-result-ranking.component";
import {LoadingScreenComponent} from './components/student-components/loading-screen/loading-screen.component'
import {GameLoginComponent} from './components/student-components/game-login/game-login.component';
import {GameUserLoginComponent} from './components/student-components/game-user-login/game-user-login.component';
import {
  WaitingPageComponent
} from './components/student-components/waiting-page/waiting-page.component';
import {QuizMakerComponent} from './components/teacher-components/quiz-maker/quiz-maker.component';
import {StatisticComponent} from './components/teacher-components/statistic/statistic.component';
import {QuizOverviewComponent} from './components/teacher-components/quiz-overview/quiz-overview.component';
import {QuestionPreviewComponent} from './components/teacher-components/question-preview/question-preview.component';
import { QuizMakerQuestionsComponent } from './components/teacher-components/quiz-maker-questions/quiz-maker-questions.component';
import { AuthGuard } from './model/auth-guard';
import { Role } from './model/leo-token';
import { LoginViewComponent } from './components/teacher-components/login-view/login-view.component';
import { SignupViewComponent } from './components/teacher-components/signup-view/signup-view.component';
import { LoginOptionsComponent } from './components/teacher-components/login-options/login-options.component';

export const routes: Routes = [
  { path: '', redirectTo: '/quizOverview', pathMatch: 'full' },
  { path: 'login', component: LoginViewComponent},
  { path: 'answerView', component: AnswerViewComponent },
  { path: 'signup', component: SignupViewComponent},
  { path: 'interimResult', component: InterimResultRankingComponent },
  { path: 'loginOptions', component: LoginOptionsComponent},
  { 
    path: 'ranking', 
    component: RankingComponent,
    canActivate: [AuthGuard], data: { 
      roles: [Role.Student]
    }
  },
  { 
    path: 'question', 
    component: QuestionComponent,
    canActivate: [AuthGuard], data: { 
      roles: [Role.Student]
    }
  },
  { 
    path: 'waitingroom', 
    component: WaitingroomComponent,
    canActivate: [AuthGuard], data: { 
      roles: [Role.Student]
    } 
  },
  { path: 'loadingScreen', component: LoadingScreenComponent },
  { path: 'gameLogin', component: GameLoginComponent },
  { path: 'gameUserLogin', component: GameUserLoginComponent },
  { path: 'waitingPage', component: WaitingPageComponent } ,
  { 
    path: 'statistic', 
    component: StatisticComponent,
    canActivate: [AuthGuard], data: { 
      roles: [Role.Student]
    } 
  },
  { 
    path: 'quizMaker', 
    component: QuizMakerComponent,
    canActivate: [AuthGuard], data: { 
      roles: [Role.Student]
    } 
  },
  {
    path: 'quizMakerQuestions',
    component: QuizMakerQuestionsComponent,
    canActivate: [AuthGuard], data: { 
      roles: [Role.Student]
    } 
  },
  { 
    path: 'quizOverview', 
    component: QuizOverviewComponent,
    canActivate: [AuthGuard], data: {
      roles: [Role.Student]
    }
  },
  { 
    path: 'questionPreview', 
    component: QuestionPreviewComponent,
    canActivate: [AuthGuard], data: { 
      roles: [Role.Student]
    } 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
