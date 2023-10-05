import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';

const routes: Routes = [
  {path: '',  redirectTo: '/teacherDemoModeQuiz', pathMatch: 'full'},
  {path: 'teacherDemoModeQuiz', component: TeacherDemoModeQuizComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
