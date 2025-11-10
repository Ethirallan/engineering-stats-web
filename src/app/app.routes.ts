import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';
import { TeamsDetailsPageComponent } from './teams/pages/teams-details-page/teams-details-page.component';
import { TeamsListPageComponent } from './teams/pages/teams-list-page/teams-list-page.component';
import { TeamsStatsPageComponent } from './teams/pages/teams-stats-page/teams-stats-page.component';
import { EngineersStatsComponent } from './engineers/pages/engineers-stats/engineers-stats.component';

export const routes: Routes = [
  { path: '', component: TeamsListPageComponent },
  { path: 'details/:id', component: TeamsDetailsPageComponent },
  { path: 'stats/:id', component: TeamsStatsPageComponent },
  { path: 'engineers/:id/stats', component: EngineersStatsComponent },
  { path: '**', component: NotFoundPageComponent },
];
