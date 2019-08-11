import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../models';
@Component({
  selector: 'app-player-stat',
  templateUrl: './player-stat.component.html',
  styleUrls: ['./player-stat.component.scss']
})
export class PlayerStatComponent implements OnInit {
  @Input() player: Player;
  @Input() filterPlayer: string;
  hidden = false;

  constructor() {}

  ngOnInit() {
    if (this.filterPlayer !== '*') {
      this.hidden = this.player.position !== this.filterPlayer;
    }
  }
}
