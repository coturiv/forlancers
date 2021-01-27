import { app, IpcMainEvent } from 'electron';
import { IpcChannels } from '../models/ipc-events';
import { MainWindow } from './app/mainWinow';
import { SplashScreen } from './app/splashScreen';
import { TrayIcon } from './app/trayIcon';
import { IpcListener } from './helpers/ipcListener';
import { Shell } from './helpers/shell';
import * as path from 'path';

import { isDevMode } from './utils';

class Application extends IpcListener {
  private static instance: Application;

  private mainWin: MainWindow;
  private trayIcon: TrayIcon;
  private shell: Shell;

  static getInstance() {
    return this.instance || (this.instance = new this());
  }

  private async createWindow() {
    if (this.mainWin) {
      return;
    }

    let splashScreen: SplashScreen;

    let loadUrl: string;

    if (isDevMode()) {
      loadUrl = 'http://localhost:3000';

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      await require('wait-on')({ resources: [loadUrl], timeout: 60 * 1000 });
    } else {
      splashScreen = SplashScreen.getInstance();
      await splashScreen.create();

      loadUrl = `file://${__dirname}/index.html`;
    }

    this.mainWin = MainWindow.getInstance({
      loadUrl,
      afterLoaded: () => splashScreen?.close()
    });

    this.mainWin.create();

    this.shell = Shell.getInstance(this.mainWin.mainWin);

    if (!this.trayIcon) {
      this.trayIcon = TrayIcon.getInstance({
        onOpen: () => {
          this.mainWin.mainWin.show();
        },
        onQuit: () => {
          app.quit();
        }
      });
    }
  }

  registerIpcListeners() {
    this.ipcMain.on(IpcChannels.Api.SelectDir, (event: IpcMainEvent, title?: string) => {
      if (!this.mainWin?.mainWin) {
        return;
      }

      event.returnValue = this.shell.chooseDir(this.mainWin.mainWin, title);
    });

    this.ipcMain.on(IpcChannels.Api.GetConfigPath, (event: IpcMainEvent) => {
      event.returnValue = path.join(app.getPath('home'), `.${app.getName()}`);
    });

    this.ipcMain.on(IpcChannels.Api.GetAppPath, (event: IpcMainEvent) => {
      event.returnValue = app.getAppPath();
    });
  }

  start() {
    // makeSingleInstance
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
    }

    app.on('ready', () => this.createWindow());
    app.on('activate', () => this.createWindow());

    // disable multiple instance
    app.on('second-instance', () => this.mainWin.focus());

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('before-quit', () => {});
  }
}

const application = Application.getInstance();
application.start();
