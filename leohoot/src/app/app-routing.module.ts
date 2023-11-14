import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';
import {StudentsMobileViewComponent} from "./students-mobile-view/students-mobile-view.component";

const routes: Routes = [
  { path: '', redirectTo: '/teacherDemoModeQuiz', pathMatch: 'full' },
  { path: 'teacherDemoModeQuiz', component: TeacherDemoModeQuizComponent },
  {path: 'studentMobileView', component: StudentsMobileViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
