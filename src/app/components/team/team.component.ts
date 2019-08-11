import { Component, OnInit, OnDestroy } from '@angular/core';
import { LeagueService } from '../../providers';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Team, Player, Fixture, League } from '../../models';
import { Subscription } from 'rxjs';

// import  from '../../models/Fixture';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy {
  team: Team;
  playersDiv = false;
  toTrade: Player[] | string[] = [];
  fixtures: Fixture[];
  private sus: Subscription;
  constructor(
    private route: ActivatedRoute,
    private io: LeagueService,

    private store: Store<{
      league: {
        league: League;
        set: boolean;
      };
    }>,
    private router: Router
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('short');

    const self = this;
    const obs = this.store.pipe(map(v => v.league));
    this.sus = obs.subscribe(value => {
      if (value.set) {
        self.team = value.league.getTeam(name);
        self.fixtures = value.league.myFixtures.filter(fix =>
          self.filter(fix, name, value.league.selectTeam)
        );
      } else {
        self.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    if (this.sus) {
      this.sus.unsubscribe();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log(this.team);
  }

  private filter(fixture: Fixture, team: string, selectTeam: string) {
    let ans =
      (fixture.home === team || fixture.away === team) &&
      (fixture.home === selectTeam || fixture.away === selectTeam);

    return ans;
  }
}
