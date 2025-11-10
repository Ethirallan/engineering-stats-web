import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { TeamsService } from './teams.service';
import { Team, Stat, Pr } from '../../shared/models/stats.models';

describe('TeamsService', () => {
  let service: TeamsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const apiUrl = '/teams';

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        TeamsService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(TeamsService);
  });

  it('should get all teams', () => {
    const mockTeams: Team[] = [{ id: '1', name: 'A' } as Team];
    httpClientSpy.get.and.returnValue(of(mockTeams));

    service.getAllTeams().subscribe(teams => {
      expect(teams).toEqual(mockTeams);
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(apiUrl);
  });

  it('should get team by id', () => {
    const mockTeam: Team = { id: '1', name: 'A' } as Team;
    httpClientSpy.get.and.returnValue(of(mockTeam));

    service.getTeamById('1').subscribe(team => {
      expect(team).toEqual(mockTeam);
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${apiUrl}/1`);
  });

  it('should create a team', () => {
    const mockTeam: Team = { id: '1', name: 'A' } as Team;
    httpClientSpy.post.and.returnValue(of(mockTeam));

    service.createTeam('A').subscribe(team => {
      expect(team).toEqual(mockTeam);
    });
    expect(httpClientSpy.post).toHaveBeenCalledWith(apiUrl, { name: 'A' });
  });

  it('should update a team', () => {
    const mockTeam: Team = { id: '1', name: 'B' } as Team;
    httpClientSpy.put.and.returnValue(of(mockTeam));

    service.updateTeam(mockTeam).subscribe(team => {
      expect(team).toEqual(mockTeam);
    });
    expect(httpClientSpy.put).toHaveBeenCalledWith(`${apiUrl}/1`, mockTeam);
  });

  it('should delete a team', () => {
    httpClientSpy.delete.and.returnValue(of(void 0));

    service.deleteTeam('1').subscribe(result => {
      expect(result).toBeUndefined();
    });
    expect(httpClientSpy.delete).toHaveBeenCalledWith(`${apiUrl}/1`);
  });

  it('should add member to team', () => {
    const mockTeam: Team = { id: '1', name: 'A' } as Team;
    httpClientSpy.post.and.returnValue(of(mockTeam));

    service.addMemberToTeam('1', 'user').subscribe(team => {
      expect(team).toEqual(mockTeam);
    });
    expect(httpClientSpy.post).toHaveBeenCalledWith(`${apiUrl}/1/members`, { username: 'user' });
  });

  it('should remove member from team', () => {
    const mockTeam: Team = { id: '1', name: 'A' } as Team;
    httpClientSpy.delete.and.returnValue(of(mockTeam));

    service.removeMemberFromTeam('1', 'user').subscribe(team => {
      expect(team).toEqual(mockTeam);
    });
    expect(httpClientSpy.delete).toHaveBeenCalledWith(`${apiUrl}/1/members/user`);
  });

  it('should get team stats', () => {
    const mockStats: Stat[] = [{
      label: 'Q1', prReviewed: 10,
      prMerged: 5,
      locAdded: 1000,
      locDeleted: 500,
      locTotal: 500,
    }];
    httpClientSpy.get.and.returnValue(of(mockStats));

    service.getTeamStats('1', 'quarter').subscribe(stats => {
      expect(stats).toEqual(mockStats);
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${apiUrl}/1/stats?period=quarter`);
  });

  it('should get team PRs', () => {
    const mockPrs: Pr[] = [{ id: 'pr1' } as Pr];

    httpClientSpy.get.and.returnValue(of(mockPrs));
    service.getTeamPRs('1', 'quarter').subscribe(prs => {
      expect(prs).toEqual(mockPrs);
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${apiUrl}/1/prs?period=quarter`);
  });

  it('should sync team stats', () => {
    httpClientSpy.get.and.returnValue(of(void 0));

    service.syncTeamStats('1').subscribe(result => {
      expect(result).toBeUndefined();
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${apiUrl}/1/update`);
  });
});
