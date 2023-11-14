import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsMobileViewComponent } from './students-mobile-view.component';

describe('StudentsMobileViewComponent', () => {
  let component: StudentsMobileViewComponent;
  let fixture: ComponentFixture<StudentsMobileViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsMobileViewComponent]
    });
    fixture = TestBed.createComponent(StudentsMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
