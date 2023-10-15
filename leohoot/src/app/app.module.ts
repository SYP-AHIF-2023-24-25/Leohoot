import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz/teacher-demo-mode-quiz.component';

@NgModule({
  declarations: [
    AppComponent,
    TeacherDemoModeQuizComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
