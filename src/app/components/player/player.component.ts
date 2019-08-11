import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../models';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() Player: Player;

  constructor() {}

  ngOnInit() {}
}
