import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDemoModeQuizComponent } from './components/teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';
import {StudentsMobileViewComponent} from "./components/students-mobile-view/students-mobile-view.component";
import { RankingComponent } from './components/ranking/ranking.component';
import { QuestionComponent } from  './components/question/question.component';
import { WaitingroomComponent } from './components/waitingroom/waitingroom.component';
import {StudentsMobileRankingComponent} from "./components/students-mobile-ranking/students-mobile-ranking.component";
import { GameTeacherViewComponent } from './components/game-teacher-view/game-teacher-view.component';
import { StudentsLoadingScreenComponent } from './components/students-loading-screen/students-loading-screen.component'
import { GameLoginComponent } from './components/game-pin-login/game-pin-login.component';
import { GameUserLoginComponent } from './components/game-user-login/game-user-login.component';
import { StudentWaitingPageComponent } from './components/students-waiting-page/students-waiting-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/teacherDemoModeQuiz', pathMatch: 'full' },
  { path: 'teacherDemoModeQuiz', component: TeacherDemoModeQuizComponent },
  {path: 'studentMobileView', component: StudentsMobileViewComponent},
  {path: 'studentMobileRanking', component: StudentsMobileRankingComponent},
  { path: 'ranking', component: RankingComponent },
  { path: 'question', component: QuestionComponent },
  { path: 'waitingroom', component: WaitingroomComponent },
  { path: 'game', component: GameTeacherViewComponent},
  { path: 'studentLoadingScreen', component: StudentsLoadingScreenComponent},
  { path: 'gameLogin', component: GameLoginComponent},
  { path: 'gameUserLogin', component: GameUserLoginComponent},
  { path: 'studentWaitingPage', component: StudentWaitingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
