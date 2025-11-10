import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { NotFoundPageComponent } from './not-found-page.component';

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NotFoundPageComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 404 message', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('404');
    expect(compiled.querySelector('p')?.textContent).toContain('Oops! Page not found');
  });

  it('should call navigateToHome when button is clicked', () => {
    spyOn(component, 'navigateToHome');
    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('click');

    expect(component.navigateToHome).toHaveBeenCalled();
  });

  it('should navigate to home when navigateToHome is called', () => {
    component.navigateToHome();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
