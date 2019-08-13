import { Injectable } from '@angular/core';

import { ipcRenderer, webFrame, remote } from 'electron';

import { from, Observable } from 'rxjs';

import * as childProcess from 'child_process';

import * as fs from 'jsonfile';

import { Team, Player, Fixture, AppTheme, IAAState } from '../models';

@Injectable({
  providedIn: 'root'
})
export default class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  url: string;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.url = window.require('is-windows')()
        ? process.env.USERPROFILE.replace(/\\/g, '/') + '/Documents/leagues'
        : './leagues';
      this.childProcess = window.require('child_process');
      this.fs = window.require('jsonfile');
    }
  }

  isElectron() {
    return window && window.process && window.process.type;
  }

  get(url, exact?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fs.readFile(
        exact
          ? window.__dirname + '/assets' + url.slice(1)
          : this.url + '/' + url,
        (err, teams) => {
          if (err) {
            console.log(err);
            let retry;
            try {
              retry = this.fs.readFileSync('./src/assets' + url.slice(1));
              resolve(retry);
            } catch (error) {
              console.log(error);
              reject(error.message);
            }
          } else {
            const b = teams.data ? teams.data : teams;
            resolve(b);
          }
        }
      );
    });
  }

  getPeeps() {
    let mib = '/assets/league-assets/teams.json';
    let url = window.__dirname;
    let promise = new Promise<{
      teams: any[];
      players: any[];
    }>((resolve, reject) => {
      this.fs.readFile(url + mib, (err, data) => {
        if (err) {
          console.log(err);
          let retry;
          try {
            retry = this.fs.readFileSync('./src/' + mib);
            resolve(retry);
          } catch (error) {
            console.log(error);
            reject(error.message);
          }
        } else {
          resolve(data);
        }
      });
    });

    return from(promise);
  }
  setLeague(name: string) {
    this.checkInitialize();

    let promise = new Promise<{
      created: true;
    }>((_, $) => {
      const fsi = window.require('fs');
      try {
        fsi.mkdirSync(this.url + '/' + name);
        _({
          created: true
        });
      } catch (err) {
        console.log(err);
        $({
          error: err.message
        });
      }
    });

    return from(promise);
  }
  private checkInitialize() {
    const fsi = window.require('fs');

    if (fsi.existsSync(this.url)) {
      return;
    }
    fsi.mkdirSync(this.url);
  }

  save(name: string, data: any) {
    this.checkInitialize();

    let url = this.url + '/' + name;
    let exists = window.require('fs').existsSync(url);
    if (!exists) {
      window.require('fs').mkdirSync(url);
    }

    let promise = new Promise<any>((rs, rj) => {
      this.fs.writeFile(url + '/league.json', data, err => {
        if (err) {
          rj(err);
          return;
        } else {
          rs({
            saved: true
          });
        }
      });
    });
    return from(promise);
  }

  checkLeagues(): Observable<{ leagues: string[] }> {
    const self = this;
    let promise = new Promise<{ leagues: string[] }>((res, rej) => {
      window.require('fs').readdir(self.url, (err, data: string[]) => {
        if (err) {
          if (err.code === 'ENOENT') {
            self.checkInitialize();
            res({
              leagues: []
            });
            return;
          }
          console.log(err);

          rej({
            error: err.message
          });

          return;
        }

        res({
          leagues: data.filter(f => f !== 'settings.json')
        });
      });
    });

    return from(promise);
  }

  delLeague(league: string) {
    const fsi = window.require('fs');
    let b = this.url + '/' + league;

    let promise = new Promise<{
      error: boolean;
      message: string;
    }>(res => {
      try {
        try {
          fsi.unlinkSync(b + '/league.json');
        } catch (err) {
          fsi.rmdirSync(b);
          res({
            error: false,
            message: 'Deleted ' + league
          });
        }
      } catch (err) {
        console.log(err);
        res({
          error: true,
          message: 'An error occured ' + err.message
        });
      }
    });
    return from(promise);
  }

  getXML(url: string, dir?: boolean): Observable<IAAState | AppTheme> {
    this.checkInitialize();
    let b = this.url;

    b += '/';
    b += url;

    let promise = new Promise<IAAState | AppTheme>((res, rej) => {
      if (dir) {
        const fsi = window.require('fs');

        const exists = fsi.existsSync(b + '/league.json');
        res({
          exists
        });
        return;
      }

      this.fs.readFile(b, (err, data) => {
        if (err && err.code === 'ENOENT') {
          if (url === 'settings.json') {
            res({
              useDefault: true
            });
          } else {
            res({
              exists: false
            });
          }
          return;
        } else if (!data && err) {
          console.log(err);

          rej({
            error: err.message
          });

          return;
        }
        res(data);
      });
    });

    return from(promise);
  }

  setSettings(
    theme: AppTheme
  ): Observable<{
    saved: boolean;
  }> {
    this.checkInitialize();
    let promise = new Promise<any>((rs, rj) => {
      this.fs.writeFile(this.url + '/settings.json', theme, err => {
        if (err) {
          rj(err);
          return;
        } else {
          rs({
            saved: true
          });
        }
      });
    });
    return from(promise);
  }
  toggleDevTools() {
    this.ipcRenderer.send('message', 'toggle');
  }
}
