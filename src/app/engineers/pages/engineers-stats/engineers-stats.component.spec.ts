import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { EngineersStatsComponent } from './engineers-stats.component';
import { EngineersService } from '../../services/engineers.service';
import { PrsService } from '../../../shared/services/prs.service';
import { Engineer, Stat, Pr } from '../../../shared/models/stats.models';

describe('EngineersStatsComponent', () => {
  let component: EngineersStatsComponent;
  let fixture: ComponentFixture<EngineersStatsComponent>;
  let engineersServiceSpy: jasmine.SpyObj<EngineersService>;
  let prsServiceSpy: jasmine.SpyObj<PrsService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    engineersServiceSpy = jasmine.createSpyObj('EngineersService', [
      'getEngineerById',
      'getEngineersStats',
      'getEngineersPRs',
      'syncEngineerStats'
    ]);
    prsServiceSpy = jasmine.createSpyObj('PrsService', ['togglePrCountInStats']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'success']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [EngineersStatsComponent],
      providers: [
        { provide: EngineersService, useValue: engineersServiceSpy },
        { provide: PrsService, useValue: prsServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: Location, useValue: locationSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? 'engineer-1' : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EngineersStatsComponent);
    component = fixture.componentInstance;
  });

  it('should load engineer and call loadData on init', () => {
    const mockEngineer: Engineer = { id: 'engineer-1', name: 'Alice' } as Engineer;
    engineersServiceSpy.getEngineerById.and.returnValue(of(mockEngineer));
    spyOn(component, 'loadData');

    component.ngOnInit();

    expect(engineersServiceSpy.getEngineerById).toHaveBeenCalledWith('engineer-1');
    expect(component.engineer()).toEqual(mockEngineer);
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should show error if getEngineerById fails', () => {
    engineersServiceSpy.getEngineerById.and.returnValue(throwError(() => ({
      error: { message: 'Not found' }
    })));

    component.ngOnInit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Not found', "Error getting engineer's details");
  });

  it('should load stats and prs in loadData', () => {
    component.engineer.set({ id: 'engineer-1', name: 'Alice' } as Engineer);
    spyOn(component, 'loadStats');
    spyOn(component, 'loadPrs');

    component.loadData('quarter');

    expect(component.selectedPeriod()).toBe('quarter');
    expect(component.loadStats).toHaveBeenCalledWith('engineer-1', 'quarter');
    expect(component.loadPrs).toHaveBeenCalledWith('engineer-1', 'quarter');
  });

  it('should load stats and set them', () => {
    const mockStats: Stat[] = [{ label: 'Q1' } as Stat];
    engineersServiceSpy.getEngineersStats.and.returnValue(of(mockStats));

    component.loadStats('engineer-1', 'quarter');

    expect(engineersServiceSpy.getEngineersStats).toHaveBeenCalledWith('engineer-1', 'quarter');
    expect(component.stats()).toEqual(mockStats);
  });

  it('should show error if loadStats fails', () => {
    engineersServiceSpy.getEngineersStats.and.returnValue(throwError(() => ({
      error: { message: 'Stats error' }
    })));

    component.loadStats('engineer-1', 'quarter');

    expect(toastrSpy.error).toHaveBeenCalledWith('Stats error', "Error getting engineer's stats");
  });

  it('should load PRs and set them', () => {
    const mockPrs: Pr[] = [{ id: 'pr1' } as Pr];
    engineersServiceSpy.getEngineersPRs.and.returnValue(of(mockPrs));

    component.loadPrs('engineer-1', 'quarter');

    expect(engineersServiceSpy.getEngineersPRs).toHaveBeenCalledWith('engineer-1', 'quarter');
    expect(component.prs()).toEqual(mockPrs);
  });

  it('should show error if loadPrs fails', () => {
    engineersServiceSpy.getEngineersPRs.and.returnValue(throwError(() => ({
      error: { message: 'PRs error' }
    })));

    component.loadPrs('engineer-1', 'quarter');

    expect(toastrSpy.error).toHaveBeenCalledWith('PRs error', "Error getting engineer's PRs");
  });

  it('should toggle PR count in stats and reload data', () => {
    const mockPr: Pr = { id: 'pr1' } as Pr;
    prsServiceSpy.togglePrCountInStats.and.returnValue(of({ ...mockPr }));
    spyOn(component, 'loadData');

    component.toggleCountInStatsAndReloadData(mockPr);

    expect(prsServiceSpy.togglePrCountInStats).toHaveBeenCalledWith(mockPr);
    expect(component.loadData).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith('Successfully updated PR', 'PR updated');
  });

  it('should show error if toggle PR count fails', () => {
    const mockPr: Pr = { id: 'pr1' } as Pr;
    prsServiceSpy.togglePrCountInStats.and.returnValue(throwError(() => ({
      error: { message: 'Toggle error' }
    })));

    component.toggleCountInStatsAndReloadData(mockPr);

    expect(toastrSpy.error).toHaveBeenCalledWith('Toggle error', 'Error updating PR');
  });

  it('should sync engineer stats and reload data', () => {
    component.engineer.set({ id: 'engineer-1', name: 'Alice' } as Engineer);
    engineersServiceSpy.syncEngineerStats.and.returnValue(of(void 0));
    spyOn(component, 'loadData');

    component.syncEngineerStats();

    expect(component.isSyncing()).toBeFalse();
    expect(engineersServiceSpy.syncEngineerStats).toHaveBeenCalledWith('engineer-1');
    expect(component.loadData).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith("Successfully synced engineer's stats", 'Engineer stats synced');
  });

  it('should show error if syncEngineerStats fails', () => {
    component.engineer.set({ id: 'engineer-1', name: 'Alice' } as Engineer);
    engineersServiceSpy.syncEngineerStats.and.returnValue(throwError(() => ({
      error: { message: 'Sync error' }
    })));

    component.syncEngineerStats();

    expect(component.isSyncing()).toBeFalse();
    expect(toastrSpy.error).toHaveBeenCalledWith('Sync error', "Error syncing engineer's stats");
  });

  it('should not sync if already syncing', () => {
    component.isSyncing.set(true);
    component.syncEngineerStats();

    expect(engineersServiceSpy.syncEngineerStats).not.toHaveBeenCalled();
  });

  it('should not sync if no engineer', () => {
    component.engineer.set(null);
    component.syncEngineerStats();

    expect(engineersServiceSpy.syncEngineerStats).not.toHaveBeenCalled();
  });

  it('should call location.back on goBack', () => {
    component.goBack();

    expect(locationSpy.back).toHaveBeenCalled();
  });
});
