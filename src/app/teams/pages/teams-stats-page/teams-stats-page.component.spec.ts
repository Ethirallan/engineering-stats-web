import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { TeamsStatsPageComponent } from './teams-stats-page.component';
import { TeamsService } from '../../services/teams.service';
import { PrsService } from '../../../shared/services/prs.service';
import { Team, Stat, Pr } from '../../../shared/models/stats.models';

describe('TeamsStatsPageComponent', () => {
  let component: TeamsStatsPageComponent;
  let fixture: ComponentFixture<TeamsStatsPageComponent>;
  let teamsServiceSpy: jasmine.SpyObj<TeamsService>;
  let prsServiceSpy: jasmine.SpyObj<PrsService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    teamsServiceSpy = jasmine.createSpyObj('TeamsService', [
      'getTeamById',
      'getTeamStats',
      'getTeamPRs',
      'syncTeamStats'
    ]);
    prsServiceSpy = jasmine.createSpyObj('PrsService', ['togglePrCountInStats']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'success']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TeamsStatsPageComponent],
      providers: [
        { provide: TeamsService, useValue: teamsServiceSpy },
        { provide: PrsService, useValue: prsServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? 'team-1' : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsStatsPageComponent);
    component = fixture.componentInstance;
  });

  it('should load team and call loadData on init', () => {
    const mockTeam: Team = { id: 'team-1', name: 'Team A' } as Team;
    teamsServiceSpy.getTeamById.and.returnValue(of(mockTeam));
    spyOn(component, 'loadData');

    component.ngOnInit();

    expect(teamsServiceSpy.getTeamById).toHaveBeenCalledWith('team-1');
    expect(component.team()).toEqual(mockTeam);
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should show error if getTeamById fails', () => {
    teamsServiceSpy.getTeamById.and.returnValue(throwError(() => ({
      error: { message: 'Not found' }
    })));

    component.ngOnInit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Not found', "Error getting team's details");
  });

  it('should navigate to team details', () => {
    component.team.set({ id: 'team-1', name: 'Team A' } as Team);
    component.showTeamDetails();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/details/team-1']);
  });

  it('should load stats and prs in loadData', () => {
    component.team.set({ id: 'team-1', name: 'Team A' } as Team);
    spyOn(component, 'loadStats');
    spyOn(component, 'loadPrs');

    component.loadData('quarter');

    expect(component.selectedPeriod()).toBe('quarter');
    expect(component.loadStats).toHaveBeenCalledWith('team-1', 'quarter');
    expect(component.loadPrs).toHaveBeenCalledWith('team-1', 'quarter');
  });

  it('should load stats and set them', () => {
    const mockStats: Stat[] = [{ label: 'Q1', prReviewed: 10, prMerged: 5, locAdded: 1000, locDeleted: 600, locTotal: 1600 }];
    teamsServiceSpy.getTeamStats.and.returnValue(of(mockStats));

    component.loadStats('team-1', 'quarter');

    expect(teamsServiceSpy.getTeamStats).toHaveBeenCalledWith('team-1', 'quarter');
    expect(component.stats()).toEqual(mockStats);
  });

  it('should show error if loadStats fails', () => {
    teamsServiceSpy.getTeamStats.and.returnValue(throwError(() => ({
      error: { message: 'Stats error' }
    })));

    component.loadStats('team-1', 'quarter');

    expect(toastrSpy.error).toHaveBeenCalledWith('Stats error', "Error getting team's stats");
  });

  it('should load PRs and set them', () => {
    const mockPrs: Pr[] = [{ id: 'pr1' } as Pr];
    teamsServiceSpy.getTeamPRs.and.returnValue(of(mockPrs));

    component.loadPrs('team-1', 'quarter');

    expect(teamsServiceSpy.getTeamPRs).toHaveBeenCalledWith('team-1', 'quarter');
    expect(component.prs()).toEqual(mockPrs);
  });

  it('should show error if loadPrs fails', () => {
    teamsServiceSpy.getTeamPRs.and.returnValue(throwError(() => ({
      error: { message: 'PRs error' }
    })));

    component.loadPrs('team-1', 'quarter');

    expect(toastrSpy.error).toHaveBeenCalledWith('PRs error', "Error getting team's PRs");
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

  it('should sync team stats and reload data', () => {
    component.team.set({ id: 'team-1', name: 'Team A' } as Team);
    teamsServiceSpy.syncTeamStats.and.returnValue(of(void 0));
    spyOn(component, 'loadData');

    component.syncTeamStats();

    expect(component.isSyncing()).toBeFalse();
    expect(teamsServiceSpy.syncTeamStats).toHaveBeenCalledWith('team-1');
    expect(component.loadData).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith("Successfully synced team's stats", 'Team stats synced');
  });

  it('should show error if syncTeamStats fails', () => {
    component.team.set({ id: 'team-1', name: 'Team A' } as Team);
    teamsServiceSpy.syncTeamStats.and.returnValue(throwError(() => ({
      error: { message: 'Sync error' }
    })));

    component.syncTeamStats();

    expect(component.isSyncing()).toBeFalse();
    expect(toastrSpy.error).toHaveBeenCalledWith('Sync error', "Error syncing team's stats");
  });

  it('should not sync if already syncing', () => {
    component.isSyncing.set(true);
    component.syncTeamStats();

    expect(teamsServiceSpy.syncTeamStats).not.toHaveBeenCalled();
  });

  it('should not sync if no team', () => {
    component.team.set(null);
    component.syncTeamStats();

    expect(teamsServiceSpy.syncTeamStats).not.toHaveBeenCalled();
  });
});
