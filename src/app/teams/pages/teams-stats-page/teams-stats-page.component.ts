import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamsService } from '../../services/teams.service';
import { Period, Pr, Stat, Team } from '../../../shared/models/stats.models';
import { CommonModule } from '@angular/common';
import { GradientButtonComponent } from '../../../shared/components/gradient-button/gradient-button.component';
import { PeriodButtonGroupComponent } from '../../../shared/components/period-button-group/period-button-group.component';
import { StatsTableComponent } from '../../../shared/components/stats-table/stats-table.component';
import { PrsTableComponent } from '../../../shared/components/prs-table/prs-table.component';
import { PrsService } from '../../../shared/services/prs.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-teams-stats-page',
  imports: [CommonModule, GradientButtonComponent, PeriodButtonGroupComponent, StatsTableComponent, PrsTableComponent],
  templateUrl: './teams-stats-page.component.html',
  styleUrl: './teams-stats-page.component.scss',
})
export class TeamsStatsPageComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private prsService = inject(PrsService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  team = signal<Team | null>(null);
  stats = signal<Stat[]>([]);
  prs = signal<Pr[]>([]);
  selectedPeriod = signal<Period>('quarter');
  isSyncing = signal<boolean>(false);

  ngOnInit() {
    const teamId = this.activatedRoute.snapshot.paramMap.get('id');
    // TODO: validated that teamId is valid uuid
    if (!teamId) {
      return;
    }
    this.teamsService.getTeamById(teamId).subscribe({
      next: (team) => {
        this.team.set(team);
        this.loadData();
      },
      error: (error) => {
        this.toastr.error(error.error.message, "Error getting team's details");
      },
    });
  }

  showTeamDetails() {
    const teamId = this.team()?.id;
    if (!teamId) {
      return;
    }
    this.router.navigate(['/details/' + teamId]);
  }

  loadData(period: Period = 'quarter') {
    const teamId = this.team()?.id;
    if (teamId) {
      this.selectedPeriod.set(period);
      this.loadStats(teamId, period);
      this.loadPrs(teamId, period);
    }
  }

  loadStats(teamId: string, period: Period = 'quarter') {
    this.teamsService.getTeamStats(teamId, period).subscribe({
      next: (stats) => {
        this.stats.set(stats);
      },
      error: (error) => {
        this.toastr.error(error.error.message, "Error getting team's stats");
      },
    });
  }

  loadPrs(teamId: string, period: Period = 'quarter') {
    this.teamsService.getTeamPRs(teamId, period).subscribe({
      next: (prs) => {
        this.prs.set(prs);
      },
      error: (error) => {
        this.toastr.error(error.error.message, "Error getting team's PRs");
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

  syncTeamStats() {
    if (this.isSyncing()) {
      return;
    }
    const teamId = this.team()?.id;
    if (!teamId) {
      return;
    }
    this.isSyncing.set(true);
    this.teamsService.syncTeamStats(teamId).subscribe({
      next: () => {
        this.loadData(this.selectedPeriod());
        this.isSyncing.set(false);
        this.toastr.success("Successfully synced team's stats", 'Team stats synced');
      },
      error: (error) => {
        this.toastr.error(error.error.message, "Error syncing team's stats");
        this.isSyncing.set(false);
      },
    });
  }
}
