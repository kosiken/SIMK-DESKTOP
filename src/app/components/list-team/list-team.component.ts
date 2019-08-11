import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Team } from '../../models';

@Component({
  selector: 'app-list-team',
  templateUrl: './list-team.component.html',
  styleUrls: ['./list-team.component.scss']
})
export class ListTeamComponent implements OnInit {
  @Input() Team: Team;
  @Output() selectT: EventEmitter<string> = new EventEmitter();
  modal = false;
  constructor() {}

  ngOnInit() {
    this.Team._sortPlayers();
  }

  toggleModal() {
    this.modal = !this.modal;
  }

  setClasses() {
    return {
      disp: true,
      modal: true,
      show: this.modal
    };
  }

  selectTeam(name) {
    this.selectT.emit(name);
  }
}
