import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {ConferenceObj} from '../../models/Rating';
import Team from '../../models/Team';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
  animations: [
    trigger('rising', [state('void', style({marginTop: '100vh'})),

      transition('void => *, * => void', [
        animate( 500)
      ])
    ])
  ]
})
export class StandingsComponent implements OnInit {
@Input() conference: ConferenceObj;
viewing = 'Eastern';
selTeam: Team;
teamView = false;
  constructor() { }

  ngOnInit() {

  }

  showTeam(team: Team)  {
    this.selTeam = team;
    this.changeView();

  }

  changeView () {
    console.log('ll')
    this.teamView = !this.teamView;
    console.log(this.teamView)
  }

}
