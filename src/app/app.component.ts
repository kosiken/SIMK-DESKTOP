import { Component, OnInit } from '@angular/core';
import { WindowService, LeagueService } from './providers';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { Location } from '@angular/common';
// import {  } from 'rxjs';
import { Observable, merge, timer, fromEvent } from 'rxjs';
import { map, debounce } from 'rxjs/operators';

interface Apptheme {
  blue: boolean;
  white: boolean;
  fullScreen: boolean;
}
interface Position {
  x: string;
  y: string;
}

interface AppEvents {
  mouse: Observable<MouseEvent>;
  keyBoard: Observable<KeyboardEvent>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  leagues: Array<string>;
  defaultTheme = 'blue';
  theme: Apptheme = {
    blue: true,
    white: false,
    fullScreen: false
  };
  togglingColors = false;
  opsPos: Position = {
    x: '100px',
    y: '50px'
  };
  hotKey: string;

  message: string;

  showOps = true;

  constructor(
    private translate: TranslateService,
    private window: WindowService
  ) {
    translate.setDefaultLang('en');
   
    // if (electronService.isElectron()) {
    //   console.log('Mode electron');
    //   console.log('Electron ipcRenderer', electronService.ipcRenderer);
    //   console.log('NodeJS childProcess', electronService.childProcess);
    // } else {
    //   console.log('Mode web');
    // }
  }

  ngOnInit() {
    this.hotKey = window.require('is-windows')() ? 'Ctrl' : 'Cmd';
    const obs = this.bindMouseClick();
    obs.mouse.subscribe(($event: MouseEvent) => this.onKeyPress($event));
    obs.keyBoard.subscribe(($event: KeyboardEvent) =>
      this.onKeyBoardPress($event)
    );

    this.window.setScreen(this.theme.fullScreen);
    //  this.loadLeagues()
  }

  setClass() {
    return {
      'app-container': true,
      blue: this.theme.blue,
      white: this.theme.white
    };
  }

  setTheme(name: string, removing: string) {
    console.log(name, removing);
  }

  onKeyPress($event: MouseEvent) {
    this.showOps = false;
    this.opsPos.y = `${$event.clientY}px`;
    this.opsPos.x = `${$event.clientX}px`;
  }

  private bindMouseClick(): AppEvents {
    const hotKeyEvent$ = [
      fromEvent(window, 'keypress'),
      fromEvent(window, 'keydown')
    ];
    const eventsType$ = [fromEvent(window, 'auxclick')];
    // we merge all kind of event as one observable.
    return {
      mouse: merge(...eventsType$).pipe(
        // We map answer to KeyboardEvent, typescript strong typing...
        map(state => state as MouseEvent)
      ),
      keyBoard: merge(...hotKeyEvent$).pipe(
        //     debounce(()=> timer(10)),
        // We map answer to KeyboardEvent, typescript strong typing...
        map(state => state as KeyboardEvent)
      )
    };
  }

  toggleFull() {
    this.theme.fullScreen = !this.theme.fullScreen;
    this.window.setScreen(this.theme.fullScreen);
    const { theme } = this;
    // this.electronService.setSettings(theme);
  }

  remOps($event) {
    this.showOps =
      $event.target.id === 'optogg' ||
      $event.target.classList.contains('closer');
  }
  closeApp() {
    if (confirm('Quitting SIMK...')) {
      this.window.closeView();
    }
  }

  onKeyBoardPress($event: KeyboardEvent) {
    // console.log(5)

    if ($event.ctrlKey || $event.metaKey) {
      switch ($event.key) {
        case 't':
          this.toggleFull();
          break;
        case 'T':
          this.toggleFull();
          break;
        case 'Q':
          this.closeApp();
          break;
        case 'q':
          this.closeApp();
          break;
      }
    }
  }
}
