import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers';

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

  les = true;
  message = 'You can name it anything you choose';
  modal: boolean;
  constructor(private api: ElectronService) {}

  ngOnInit() {
    this.api.checkLeagues().subscribe(({ leagues }) => {
      this.ls = leagues;
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
}
