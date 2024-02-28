import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StudentsMobileViewComponent} from "./components/students-mobile-view/students-mobile-view.component";
import { RankingComponent } from './components/ranking/ranking.component';
import { QuestionComponent } from  './components/question/question.component';
import { WaitingroomComponent } from './components/waitingroom/waitingroom.component';
import {StudentsMobileRankingComponent} from "./components/students-mobile-ranking/students-mobile-ranking.component";
import { StudentsLoadingScreenComponent } from './components/students-loading-screen/students-loading-screen.component'
import { GameLoginComponent } from './components/game-pin-login/game-pin-login.component';
import { GameUserLoginComponent } from './components/game-user-login/game-user-login.component';
import { StudentWaitingPageComponent } from './components/students-waiting-page/students-waiting-page.component';
import { QuizMakerComponent } from './components/quiz-maker/quiz-maker.component';
import { DesignQuestionComponent } from './components/design-question/design-question.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { GamesComponent } from './components/games/games.component';
import { QuestionPreviewComponent } from './components/question-preview/question-preview.component';

const routes: Routes = [
  { path: '', redirectTo: '/question', pathMatch: 'full' },
  {path: 'studentMobileView', component: StudentsMobileViewComponent},
  {path: 'studentMobileRanking', component: StudentsMobileRankingComponent},
  { path: 'ranking', component: RankingComponent },
  { path: 'question', component: QuestionComponent },
  { path: 'waitingroom', component: WaitingroomComponent },
  { path: 'studentLoadingScreen', component: StudentsLoadingScreenComponent},
  { path: 'gameLogin', component: GameLoginComponent},
  { path: 'gameUserLogin', component: GameUserLoginComponent},
  { path: 'studentWaitingPage', component: StudentWaitingPageComponent},
  { path: 'statistic', component: StatisticComponent},
  { path: 'designQuestion', component: DesignQuestionComponent},
  { path: 'quizMaker', component: QuizMakerComponent},
  { path: 'games', component: GamesComponent},
  { path: 'preview', component: QuestionPreviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
