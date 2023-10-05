import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDemoModeQuizComponent } from './teacher-demo-mode-quiz.component';

describe('TeacherDemoModeQuizComponent', () => {
  let component: TeacherDemoModeQuizComponent;
  let fixture: ComponentFixture<TeacherDemoModeQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherDemoModeQuizComponent]
    });
    fixture = TestBed.createComponent(TeacherDemoModeQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
