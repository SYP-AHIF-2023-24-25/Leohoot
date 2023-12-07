import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';
import {StudentsMobileViewComponent} from "./students-mobile-view/students-mobile-view.component";
import { RankingComponent } from './ranking/ranking.component';
import { QuestionComponent } from './question/question.component';
import { WaitingroomComponent } from './waitingroom/waitingroom.component';
import {StudentsMobileRankingComponent} from "./students-mobile-ranking/students-mobile-ranking.component";
import { GameTeacherViewComponent } from './game-teacher-view/game-teacher-view.component';
import { StudentsLoadingScreenComponent } from './students-loading-screen/students-loading-screen.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
