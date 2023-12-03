import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsLoadingScreenComponent } from './students-loading-screen.component';

describe('StudentsLoadingScreenComponent', () => {
  let component: StudentsLoadingScreenComponent;
  let fixture: ComponentFixture<StudentsLoadingScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsLoadingScreenComponent]
    });
    fixture = TestBed.createComponent(StudentsLoadingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
