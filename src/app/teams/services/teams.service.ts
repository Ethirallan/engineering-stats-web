import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Period, Pr, Stat, Team } from '../../shared/models/stats.models';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + '/teams';

  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  getTeamById(teamId: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${teamId}`);
  }

  createTeam(teamName: string): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, { name: teamName });
  }

  updateTeam(team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${team.id}`, team);
  }

  deleteTeam(teamId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}`);
  }

  addMemberToTeam(teamId: string, username: string): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/members`, {
      username,
    });
  }

  removeMemberFromTeam(teamId: string, username: string): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/${teamId}/members/${username}`);
  }

  getTeamStats(teamId: string, period: Period = 'quarter'): Observable<Stat[]> {
    return this.http.get<Stat[]>(`${this.apiUrl}/${teamId}/stats?period=${period}`);
  }

  getTeamPRs(teamId: string, period: Period = 'quarter'): Observable<Pr[]> {
    return this.http.get<Pr[]>(`${this.apiUrl}/${teamId}/prs?period=${period}`);
  }

  syncTeamStats(id: string): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/${id}/update`);
  }
}
