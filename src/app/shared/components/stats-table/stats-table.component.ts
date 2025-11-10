import { Component, input } from '@angular/core';
import { Stat } from '../../models/stats.models';

@Component({
  selector: 'app-stats-table',
  imports: [],
  templateUrl: './stats-table.component.html',
  styleUrl: './stats-table.component.scss',
})
export class StatsTableComponent {
  stats = input<Stat[]>([]);
}
