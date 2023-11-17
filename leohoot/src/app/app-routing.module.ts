import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';
import { RankingComponent } from './ranking/ranking.component';
import { QuestionComponent } from './question/question.component';
import { GameTeacherViewComponent } from './game-teacher-view/game-teacher-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/teacherDemoModeQuiz', pathMatch: 'full' },
  { path: 'teacherDemoModeQuiz', component: TeacherDemoModeQuizComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'question', component: QuestionComponent },
  { path: 'game', component: GameTeacherViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
