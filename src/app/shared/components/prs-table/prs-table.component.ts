import { Component, input, output } from '@angular/core';
import { Pr, PRState } from '../../models/stats.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prs-table',
  imports: [CommonModule],
  templateUrl: './prs-table.component.html',
  styleUrl: './prs-table.component.scss',
})
export class PrsTableComponent {
  prs = input<Pr[]>([]);
  onCountInStatsChanged = output<Pr>();

  getRowBackgroundColor(pr: Pr) {
    if (!pr.countInStats) return 'bg-ctp-subtext0';
    if (pr.state === PRState.MERGED) return 'bg-ctp-green-600';
    if (pr.state === PRState.CLOSED) return 'bg-ctp-maroon';
    if (pr.state === PRState.DRAFT) return 'bg-ctp-sapphire';
    return 'bg-ctp-yellow';
  }

  getReviewTime(opened: string, closed: string | null): string {
    if (!closed) closed = new Date().toISOString();
    const openedDate = new Date(opened);
    const closedDate = new Date(closed);
    const diffTime = Math.abs(closedDate.getTime() - openedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  }

  toggleCountInStats(pr: Pr) {
    this.onCountInStatsChanged.emit(pr);
  }
}
