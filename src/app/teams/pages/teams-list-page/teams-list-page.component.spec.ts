import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TeamsListPageComponent } from './teams-list-page.component';
import { TeamsService } from '../../services/teams.service';
import { ToastrService } from 'ngx-toastr';
import { Team } from '../../../shared/models/stats.models';

describe('TeamsListPageComponent', () => {
  let component: TeamsListPageComponent;
  let fixture: ComponentFixture<TeamsListPageComponent>;
  let teamsServiceSpy: jasmine.SpyObj<TeamsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    teamsServiceSpy = jasmine.createSpyObj('TeamsService', ['getAllTeams', 'createTeam']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'success']);

    await TestBed.configureTestingModule({
      imports: [TeamsListPageComponent],
      providers: [
        { provide: TeamsService, useValue: teamsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsListPageComponent);
    component = fixture.componentInstance;
  });

  it('should load teams on init', () => {
    const mockTeams: Team[] = [
      { id: '1', name: 'Alpha' } as Team,
      { id: '2', name: 'Beta' } as Team
    ];
    teamsServiceSpy.getAllTeams.and.returnValue(of(mockTeams));

    component.ngOnInit();

    expect(teamsServiceSpy.getAllTeams).toHaveBeenCalled();
    expect(component.teams()).toEqual(mockTeams);
  });

  it('should show error if loading teams fails', () => {
    teamsServiceSpy.getAllTeams.and.returnValue(throwError(() => ({
      error: { message: 'Failed to load' }
    })));

    component.ngOnInit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Failed to load', 'Error getting teams list');
  });

  it('should create a new team and reset input', () => {
    const mockTeam: Team = { id: '3', name: 'Gamma' } as Team;
    component.teams.set([{ id: '1', name: 'Alpha' } as Team]);
    component.newTeamName.set('Gamma');
    teamsServiceSpy.createTeam.and.returnValue(of(mockTeam));

    component.createNewTeam();

    expect(teamsServiceSpy.createTeam).toHaveBeenCalledWith('Gamma');
    expect(component.teams()).toContain(mockTeam);
    expect(component.newTeamName()).toBe('');
    expect(toastrSpy.success).toHaveBeenCalledWith('Successfully created team', 'Team created');
  });

  it('should not create a team if name is empty or whitespace', () => {
    component.newTeamName.set('   ');
    component.createNewTeam();

    expect(teamsServiceSpy.createTeam).not.toHaveBeenCalled();
  });

  it('should show error if creating a team fails', () => {
    component.newTeamName.set('Delta');
    teamsServiceSpy.createTeam.and.returnValue(throwError(() => ({
      error: { message: 'Create failed' }
    })));

    component.createNewTeam();

    expect(toastrSpy.error).toHaveBeenCalledWith('Create failed', 'Error creating team');
  });

  it('should navigate to team details', () => {
    component.showTeamDetails('123');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/details/123']);
  });
});
