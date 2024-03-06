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
import {QuestionDesignerComponent} from './components/teacher-components/question-designer/question-designer.component';
import {StatisticComponent} from './components/teacher-components/statistic/statistic.component';
import {QuizOverviewComponent} from './components/teacher-components/quiz-overview/quiz-overview.component';
import {QuestionPreviewComponent} from './components/teacher-components/question-preview/question-preview.component';

const routes: Routes = [
  { path: '', redirectTo: '/question', pathMatch: 'full' },
  {path: 'answerView', component: AnswerViewComponent},
  {path: 'interimResult', component: InterimResultRankingComponent},
  { path: 'ranking', component: RankingComponent },
  { path: 'question', component: QuestionComponent },
  { path: 'waitingroom', component: WaitingroomComponent },
  { path: 'loadingScreen', component: LoadingScreenComponent},
  { path: 'gameLogin', component: GameLoginComponent},
  { path: 'gameUserLogin', component: GameUserLoginComponent},
  { path: 'waitingPage', component: WaitingPageComponent},
  { path: 'statistic', component: StatisticComponent},
  { path: 'questionDesigner', component: QuestionDesignerComponent},
  { path: 'quizMaker', component: QuizMakerComponent},
  { path: 'quizOverview', component: QuizOverviewComponent},
  { path: 'questionPreview', component: QuestionPreviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
