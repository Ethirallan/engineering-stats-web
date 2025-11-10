import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Engineer, Period, Pr, Stat } from '../../shared/models/stats.models';

@Injectable({
  providedIn: 'root',
})
export class EngineersService {
  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + '/engineers';

  getEngineerById(engineerId: string): Observable<Engineer> {
    return this.http.get<Engineer>(`${this.apiUrl}/${engineerId}`);
  }

  getEngineersStats(engineerId: string, period: Period = 'quarter'): Observable<Stat[]> {
    return this.http.get<Stat[]>(`${this.apiUrl}/${engineerId}/stats?period=${period}`);
  }

  getEngineersPRs(engineerId: string, period: Period = 'quarter'): Observable<Pr[]> {
    return this.http.get<Pr[]>(`${this.apiUrl}/${engineerId}/prs?period=${period}`);
  }

  syncEngineerStats(id: string): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/${id}/update`);
  }
}
