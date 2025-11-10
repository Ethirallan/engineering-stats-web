import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stat, Engineer, Period, Pr } from '../../../shared/models/stats.models';
import { EngineersService } from '../../services/engineers.service';
import { StatsTableComponent } from '../../../shared/components/stats-table/stats-table.component';
import { PeriodButtonGroupComponent } from '../../../shared/components/period-button-group/period-button-group.component';
import { GradientButtonComponent } from '../../../shared/components/gradient-button/gradient-button.component';
import { Location } from '@angular/common';
import { PrsService } from '../../../shared/services/prs.service';
import { PrsTableComponent } from '../../../shared/components/prs-table/prs-table.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-engineers-stats',
  imports: [StatsTableComponent, PeriodButtonGroupComponent, GradientButtonComponent, PrsTableComponent],
  templateUrl: './engineers-stats.component.html',
  styleUrl: './engineers-stats.component.scss',
})
export class EngineersStatsComponent implements OnInit {
  private engineersService = inject(EngineersService);
  private prsService = inject(PrsService);
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private toastr = inject(ToastrService);

  engineer = signal<Engineer | null>(null);
  stats = signal<Stat[]>([]);
  prs = signal<Pr[]>([]);
  selectedPeriod = signal<Period>('quarter');
  isSyncing = signal<boolean>(false);

  ngOnInit() {
    const engineerId = this.activatedRoute.snapshot.paramMap.get('id');
    // TODO: validated that engineerId is valid uuid
    if (!engineerId) {
      return;
    }
    this.engineersService.getEngineerById(engineerId).subscribe({
      next: (engineer) => {
        this.engineer.set(engineer);
        this.loadData();
      },
      error: (error) => {
        this.toastr.error(error.error.message, "Error getting engineer's details");
      },
    });
  }

  loadData(period: Period = 'quarter') {
    const engineerId = this.engineer()?.id;
    if (engineerId) {
      this.selectedPeriod.set(period);
      this.loadStats(engineerId, period);
      this.loadPrs(engineerId, period);
    }
  }

  loadStats(engineerId: string, period: Period = 'quarter') {
    this.engineersService.getEngineersStats(engineerId, period).subscribe({
      next: (stats) => {
        this.stats.set(stats);
      },
      error: (error) => {
        this.toastr.error(error.error.message, "Error getting engineer's stats");
      },
    });
  }

  loadPrs(engineerId: string, period: Period = 'quarter') {
    this.engineersService.getEngineersPRs(engineerId, period).subscribe({
      next: (prs) => {
        this.prs.set(prs);
      },
      error: (error) => {
        this.toastr.error(error.error.message, "Error getting engineer's PRs");
      },
    });
  }

  toggleCountInStatsAndReloadData(pr: Pr) {
    this.prsService.togglePrCountInStats(pr).subscribe({
      next: () => {
        this.loadData(this.selectedPeriod());
        this.toastr.success('Successfully updated PR', 'PR updated');
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error updating PR');
      },
    });
  }

  syncEngineerStats() {
    if (this.isSyncing()) {
      return;
    }
    const id = this.engineer()?.id;
    if (!id) {
      return;
    }
    this.isSyncing.set(true);
    this.engineersService.syncEngineerStats(id).subscribe({
      next: () => {
        this.loadData(this.selectedPeriod());
        this.isSyncing.set(false);
        this.toastr.success("Successfully synced engineer's stats", 'Engineer stats synced');
      },
      error: (error) => {
        this.toastr.error(error.error.message, "Error syncing engineer's stats");
        this.isSyncing.set(false);
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
