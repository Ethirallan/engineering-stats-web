import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamsDetailsPageComponent } from './teams-details-page.component';
import { TeamsService } from '../../services/teams.service';
import { ToastrService } from 'ngx-toastr';
import { Team } from '../../../shared/models/stats.models';

describe('TeamsDetailsPageComponent', () => {
  let component: TeamsDetailsPageComponent;
  let fixture: ComponentFixture<TeamsDetailsPageComponent>;
  let teamsServiceSpy: jasmine.SpyObj<TeamsService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    teamsServiceSpy = jasmine.createSpyObj('TeamsService', [
      'getTeamById',
      'addMemberToTeam',
      'removeMemberFromTeam',
      'deleteTeam'
    ]);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'success']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TeamsDetailsPageComponent],
      providers: [
        { provide: TeamsService, useValue: teamsServiceSpy },
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

    fixture = TestBed.createComponent(TeamsDetailsPageComponent);
    component = fixture.componentInstance;
  });

  it('should load team details on init', () => {
    const mockTeam: Team = { id: 'team-1', name: 'Team A', engineers: [] } as Team;
    teamsServiceSpy.getTeamById.and.returnValue(of(mockTeam));

    component.ngOnInit();

    expect(teamsServiceSpy.getTeamById).toHaveBeenCalledWith('team-1');
    expect(component.team()).toEqual(mockTeam);
  });

  it('should show error if loading team details fails', () => {
    teamsServiceSpy.getTeamById.and.returnValue(throwError(() => ({
      error: { message: 'Failed to load' }
    })));

    component.ngOnInit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Failed to load', "Error getting team's details");
  });

  it('should add a member to the team', () => {
    const mockTeam: Team = { id: 'team-1', name: 'Team A', engineers: [] } as Team;
    component.team.set(mockTeam);
    component.newMemberUsername.set('primagen');
    teamsServiceSpy.addMemberToTeam.and.returnValue(of(mockTeam));

    component.addMemberToTeam();

    expect(teamsServiceSpy.addMemberToTeam).toHaveBeenCalledWith('team-1', 'primagen');
    expect(component.team()).toEqual(mockTeam);
    expect(component.newMemberUsername()).toBe('');
    expect(toastrSpy.success).toHaveBeenCalledWith('Successfully added team member', 'Team member added');
  });

  it('should not add member if username is empty', () => {
    component.newMemberUsername.set('   ');

    component.addMemberToTeam();

    expect(teamsServiceSpy.addMemberToTeam).not.toHaveBeenCalled();
  });

  it('should show error if adding a member fails', () => {
    const mockTeam: Team = { id: 'team-1', name: 'Team A', engineers: [] } as Team;
    component.team.set(mockTeam);
    component.newMemberUsername.set('tj');
    teamsServiceSpy.addMemberToTeam.and.returnValue(throwError(() => ({
      error: { message: 'Add failed' }
    })));

    component.addMemberToTeam();

    expect(toastrSpy.error).toHaveBeenCalledWith('Add failed', 'Error adding team member');
  });

  it('should remove a member from the team', () => {
    const mockTeam: Team = { id: 'team-1', name: 'Team A', engineers: [] } as Team;
    component.team.set(mockTeam);
    teamsServiceSpy.removeMemberFromTeam.and.returnValue(of(mockTeam));

    component.removeMemberFromTeam('primagen');

    expect(teamsServiceSpy.removeMemberFromTeam).toHaveBeenCalledWith('team-1', 'primagen');
    expect(component.team()).toEqual(mockTeam);
    expect(toastrSpy.success).toHaveBeenCalledWith('Successfully removed team member', 'Team member removed');
  });

  it('should show error if removing a member fails', () => {
    const mockTeam: Team = { id: 'team-1', name: 'Team A', engineers: [] } as Team;
    component.team.set(mockTeam);
    teamsServiceSpy.removeMemberFromTeam.and.returnValue(throwError(() => ({
      error: { message: 'Remove failed' }
    })));

    component.removeMemberFromTeam('tj');

    expect(toastrSpy.error).toHaveBeenCalledWith('Remove failed', 'Error removing team member');
  });

  it('should delete the team and navigate home', () => {
    const mockTeam: Team = { id: 'team-1', name: 'Team A', engineers: [] } as Team;
    component.team.set(mockTeam);
    teamsServiceSpy.deleteTeam.and.returnValue(of(void 0));

    component.deleteTeam();

    expect(teamsServiceSpy.deleteTeam).toHaveBeenCalledWith('team-1');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(toastrSpy.success).toHaveBeenCalledWith('Successfully deleted team', 'Team deleted');
  });

  it('should show error if deleting the team fails', () => {
    const mockTeam: Team = { id: 'team-1', name: 'Team A', engineers: [] } as Team;
    component.team.set(mockTeam);
    teamsServiceSpy.deleteTeam.and.returnValue(throwError(() => ({
      error: { message: 'Delete failed' }
    })));

    component.deleteTeam();

    expect(toastrSpy.error).toHaveBeenCalledWith('Delete failed', 'Error deleting team');
  });

  it('should navigate to team stats', () => {
    const mockTeam: Team = { id: 'team-1', name: 'Team A', engineers: [] } as Team;
    component.team.set(mockTeam);

    component.showTeamStats();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/stats/team-1']);
  });

  it('should navigate to engineer stats', () => {
    component.showEngineerStats('eng-1');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/engineers/eng-1/stats']);
  });
});
