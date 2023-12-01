import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsMobileRankingComponent } from './students-mobile-ranking.component';

describe('StudentsMobileRankingComponent', () => {
  let component: StudentsMobileRankingComponent;
  let fixture: ComponentFixture<StudentsMobileRankingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsMobileRankingComponent]
    });
    fixture = TestBed.createComponent(StudentsMobileRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
