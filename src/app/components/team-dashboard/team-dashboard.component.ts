import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Team, Fixture, Player } from '../../models';

@Component({
  selector: 'app-team-dashboard',
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.scss']
})
export class TeamDashboardComponent implements OnInit {
  @Input() team: Team;
  @Input() fixtures: Fixture[];
  @Input() messages: any[];
  @Output() bilde: EventEmitter<Fixture> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    // this.showing = 'show';
  }

  playUntil(f: Fixture) {
    this.bilde.emit(f);
  }
  play() {
    let fixture = this.fixtures.find(f => !f.played);
    this.playUntil(fixture);
  }
}
