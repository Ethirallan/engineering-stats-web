import { Component, inject, OnInit, signal } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Team } from '../../../shared/models/stats.models';
import { DeleteComponent } from '../../../shared/icons/delete/delete.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { GradientButtonComponent } from '../../../shared/components/gradient-button/gradient-button.component';

@Component({
  selector: 'app-teams-details-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DeleteComponent, GradientButtonComponent],
  templateUrl: './teams-details-page.component.html',
  styleUrl: './teams-details-page.component.scss',
})
export class TeamsDetailsPageComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  team = signal<Team | null>(null);
  newMemberUsername = signal<string>('');

  ngOnInit() {
    const teamId = this.activatedRoute.snapshot.paramMap.get('id');
    // TODO: validated that teamId is valid uuid
    if (!teamId) {
      return;
    }
    this.teamsService.getTeamById(teamId).subscribe({
      next: (team) => {
        this.team.set(team);
      },
      error: (error) => {
        this.toastr.error(error.error.message, "Error getting team's details");
      },
    });
  }

  addMemberToTeam() {
    const username = this.newMemberUsername();
    const teamId = this.team()?.id;
    if (username.trim() === '' || !teamId) {
      return;
    }
    this.teamsService.addMemberToTeam(teamId, username).subscribe({
      next: (updatedTeam) => {
        this.team.update(() => updatedTeam);
        this.newMemberUsername.set('');
        this.toastr.success('Successfully added team member', 'Team member added');
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error adding team member');
      },
    });
  }

  removeMemberFromTeam(memberId: string) {
    const teamId = this.team()?.id;
    if (!teamId) {
      return;
    }
    this.teamsService.removeMemberFromTeam(teamId, memberId).subscribe({
      next: (updatedTeam) => {
        this.team.update(() => updatedTeam);
        this.toastr.success('Successfully removed team member', 'Team member removed');
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error removing team member');
      },
    });
  }

  deleteTeam() {
    const teamId = this.team()?.id;
    if (!teamId) {
      return;
    }
    this.teamsService.deleteTeam(teamId).subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.toastr.success('Successfully deleted team', 'Team deleted');
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error deleting team');
      },
    });
  }

  showTeamStats() {
    const teamId = this.team()?.id;
    if (!teamId) {
      return;
    }
    this.router.navigate(['/stats/' + teamId]);
  }

  showEngineerStats(engineerId: string) {
    if (!engineerId) {
      return;
    }
    this.router.navigate(['/engineers/' + engineerId + '/stats']);
  }
}
