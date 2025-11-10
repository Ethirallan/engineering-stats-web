import { Component, inject, OnInit, signal } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Team } from '../../../shared/models/stats.models';
import { CommonModule } from '@angular/common';
import { GradientButtonComponent } from '../../../shared/components/gradient-button/gradient-button.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-teams-list-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, GradientButtonComponent],
  templateUrl: './teams-list-page.component.html',
  styleUrl: './teams-list-page.component.scss',
})
export class TeamsListPageComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  teams = signal<Team[]>([]);
  newTeamName = signal<string>('');

  ngOnInit() {
    this.teamsService.getAllTeams().subscribe({
      next: (teams) => {
        this.teams.set(teams);
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error getting teams list');
      },
    });
  }

  createNewTeam() {
    const teamName = this.newTeamName();
    if (teamName.trim() === '') {
      return;
    }
    this.teamsService.createTeam(teamName).subscribe({
      next: (newTeam) => {
        this.teams.update((teams) => [...teams, newTeam]);
        this.newTeamName.set('');
        this.toastr.success('Successfully created team', 'Team created');
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error creating team');
      },
    });
  }

  showTeamDetails(teamId: string) {
    this.router.navigate(['/details/' + teamId]);
  }
}
