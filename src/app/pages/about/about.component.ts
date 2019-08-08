import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
// import {ElectronService} from '../../providers/electron.service';
import { AppConfig } from '../../../environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  bods = `#DOCS`;
  urlPage = './league-assets/about.md';
  assetUrl: string;

  constructor(private location: Location) {}

  ngOnInit() {
    this.assetUrl = AppConfig.production ? './assets/' : '../../../assets/';
  }
  goBack(): void {
    this.location.back();
  }
}
