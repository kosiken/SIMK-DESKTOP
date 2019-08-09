import { Component, OnInit } from '@angular/core';
import { ElectronService, LeagueService } from '../../providers';
import { Observable, fromEvent } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  leagueName = '';
  created = false;
  been = false;
  ls: string[] = [];
  autosave = true;
  dragging: string;
  les = true;
  message = 'You can name it anything you choose';
  modal: boolean;
  drops$: Observable<Event>;

  constructor(private api: ElectronService, private io: LeagueService) {}

  ngOnInit() {
    this.drops$ = fromEvent(document.getElementById('delete'), 'drop');
    this.drops$.subscribe(this.drop.bind(this));
    this.api.checkLeagues().subscribe(({ leagues }) => {
      this.ls = leagues;
      this.leagueName = 'SIMK' + (leagues.length ? leagues.length : '');
    });
  }

  getValid() {
    if (this.ls && this.leagueName) {
      let b = this.ls
        .map(i => i.toLowerCase())
        .includes(this.leagueName.toLowerCase());
      if (b) {
        this.message = this.leagueName + ' already exists';
      } else {
        this.message = 'You can name it anything you choose';
      }
      return b;
    }
    this.message = 'You can name it anything you choose';
    return !this.leagueName;
  }

  createLeague() {
    if (!this.leagueName) {
      this.leagueName = 'newLeague-' + this.ls.length;
    }
    this.api.setLeague(this.leagueName).subscribe(d => {
      if (d.created) {
        this.ls.push(this.leagueName);
      }
    });
  }

  onToggle() {
    this.autosave = !this.autosave;
  }

  doDaThang(e, rem: boolean) {
    e.preventDefault();
    if (rem) {
      document.getElementById('dels').classList.remove('mat-error');
    } else {
      document.getElementById('dels').classList.add('mat-error');
    }
  }

  drag(league: string) {
    this.dragging = league;
  }
  drop() {
    if (this.dragging) {
      this._deleteL(this.dragging);
    }
  }

  private _deleteL(l: string) {
    const self = this;
    this.api.delLeague(l).subscribe(v => {
      if (!v.error) {
        self.io._log(v.message);
        self.ls = self.ls.filter(i => i !== l);
      } else {
        self.io._log(v.message, v.error);
      }
    });
  }
}
