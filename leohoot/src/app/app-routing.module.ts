import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';
import {StudentsMobileViewComponent} from "./students-mobile-view/students-mobile-view.component";
import { RankingComponent } from './ranking/ranking.component';
import { QuestionComponent } from './question/question.component';
import {StudentsMobileRankingComponent} from "./students-mobile-ranking/students-mobile-ranking.component";

const routes: Routes = [
  { path: '', redirectTo: '/teacherDemoModeQuiz', pathMatch: 'full' },
  { path: 'teacherDemoModeQuiz', component: TeacherDemoModeQuizComponent },
  {path: 'studentMobileView', component: StudentsMobileViewComponent},
  {path: 'studentMobileRanking', component: StudentsMobileRankingComponent},
  { path: 'ranking', component: RankingComponent },
  { path: 'question', component: QuestionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
