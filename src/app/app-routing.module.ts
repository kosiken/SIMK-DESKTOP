import { StatsComponent } from './components/stats/stats.component';
import { StandingsComponent } from './components/standings/standings.component';
// import { PlayerComponent } from './components/player/player.component';
import { TeamComponent } from './components/team/team.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeagueDashboardComponent } from './components/league-dashboard/league-dashboard.component';
import { AboutComponent } from './pages/about/about.component';

// import {SelectorLeagueComponent} from './components/selector-league/selector-league.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'league/:name',
    component: LeagueDashboardComponent
  },

  {
    path: 'team/:short',
    component: TeamComponent
  },
  {
    path: 'stands',
    component: StandingsComponent
  },
  {
    path: 'stats',
    component: StatsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
