import { Component, OnInit } from '@angular/core';
import { WindowService, ElectronService } from './providers';
import { TranslateService } from '@ngx-translate/core';
// import { AppConfig } from '../environments/environment';
// import { Location } from '@angular/common';
// import {  } from 'rxjs';
import { Observable, merge, timer, fromEvent } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { map, debounce } from 'rxjs/operators';
import { AppTheme, Position, AppEvents, League } from './models';
import { newMessage } from './store/actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  leagues: Array<string>;
  defaultTheme = 'blue';
  theme: any = {
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
    private electronService: ElectronService,
    private window: WindowService,
    private store: Store<{
      league: League;
      set: boolean;
      count?: number;
    }>
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
    const self = this
    this.electronService.getXML('settings.json').subscribe((value: AppTheme ) => {
      self.theme  = value;
    });
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
    if(this.theme[name]) {
      return
    }
    this.theme[name] = true;
    this.theme[removing] = false;
    const theme = this.theme;
    const self = this;
    this.electronService.setSettings(theme).subscribe({
      next(v) {
        if (v.saved) {
          self.store.dispatch(
            newMessage({
              error: false,
              message: 'chenged theme to ' + name + ' and saved settings'
            })
          );
        } else {
          self.store.dispatch(
            newMessage({
              error: false,
              message: `chenged theme to
                 ${name} but failed to save settings, please report a bug to kosikenspears@gmail.com if this persists`
            })
          );
        }
      }
    });
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
    const theme = this.theme;
    const self = this;
    this.electronService.setSettings(theme).subscribe({
      next(v) {
        if (v.saved) {
          self.store.dispatch(
            newMessage({
              error: false,
              message: 'Toggled full screen'
            })
          );
        } else {
          self.store.dispatch(
            newMessage({
              error: false,
              message:
                'Toggled full screen but failed to save settings, please report a bug to kosikenspears@gmail.com if this persists'
            })
          );
        }
      }
    });
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
