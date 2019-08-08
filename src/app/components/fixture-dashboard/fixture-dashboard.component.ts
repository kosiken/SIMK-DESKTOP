import {Component, Input, OnInit} from '@angular/core';
// import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-fixture-dashboard',
  templateUrl: './fixture-dashboard.component.html',
  styleUrls: ['./fixture-dashboard.component.scss']

})
export class FixtureDashboardComponent implements OnInit {
  showOps = {
    wrapper: true,
    comeOut: false
  };
  options = [
    { name: 'MyTeam', icon: 'home' },
    { name: 'Standings', icon: 'format_line_spacing' },
    { name: 'Stats', icon: 'insert_chart' },
    {
      name: 'Trade Finder',
      icon: 'search'
    },
    { name: 'Calender', icon: 'perm_contact_calendar' }
  ];

  constructor() {}

  ngOnInit() {}
  tween() {
    // this.showOps.wrapper = !this.showOps.wrapper;
    this.showOps.comeOut = !this.showOps.comeOut;
  }
  setClass() {
    return this.showOps;
  }
}
