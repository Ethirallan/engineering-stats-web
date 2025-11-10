import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrsTableComponent } from './prs-table.component';

describe('PrsTableComponent', () => {
  let component: PrsTableComponent;
  let fixture: ComponentFixture<PrsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
