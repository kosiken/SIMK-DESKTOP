import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Team, Fixture, Player} from '../../models';

@Component({
  selector: 'app-team-dashboard-navigator',
  templateUrl: './team-dashboard-navigator.component.html',
  styleUrls: ['./team-dashboard-navigator.component.scss']
})
export class TeamDashboardNavigatorComponent implements OnInit {
 @Input() team: Team;
@Input() fixtures: Fixture[];




  constructor() { }

  ngOnInit() {
    // this.showing = 'show';
  }

}

