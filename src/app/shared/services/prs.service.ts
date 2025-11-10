import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Pr } from '../models/stats.models';

@Injectable({
  providedIn: 'root',
})
export class PrsService {
  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + '/prs';

  togglePrCountInStats(pr: Pr): Observable<Pr> {
    return this.http.patch<Pr>(`${this.apiUrl}/${pr.id}`, {
      countInStats: !pr.countInStats,
    });
  }
}
