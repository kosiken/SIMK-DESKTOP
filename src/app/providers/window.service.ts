import { BrowserWindow } from 'electron';
import { Injectable } from '@angular/core';

@Injectable()
export default class WindowService {
  window: BrowserWindow;

  constructor() {
    if (this.isElectron()) {
      this.window = window.require('electron').remote.getCurrentWindow();
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };
  closeView() {
    this.window.close();
  }
  setScreen(full: boolean) {
    // this.window.setIcon
    this.window.setFullScreen(full);
  }
}
