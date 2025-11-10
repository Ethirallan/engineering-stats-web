import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodButtonGroupComponent } from './period-button-group.component';

describe('PeriodButtonGroupComponent', () => {
  let component: PeriodButtonGroupComponent;
  let fixture: ComponentFixture<PeriodButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodButtonGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeriodButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
