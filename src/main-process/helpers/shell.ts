import { dialog, BrowserWindow, IpcMainEvent, shell } from 'electron';
import { spawn } from 'child_process';

import { IpcListener } from './ipcListener';
import { IpcChannels } from '../../models/ipc-events';

export class Shell extends IpcListener {
  private static instance: Shell;

  static getInstance(activeWin: BrowserWindow) {
    return this.instance || (this.instance = new this(activeWin));
  }

  private activeWin: BrowserWindow;
  private pids: number[] = [];

  constructor(activeWin: BrowserWindow) {
    super();

    this.activeWin = activeWin;
  }

  chooseDir(win: BrowserWindow, title?: string) {
    return dialog.showOpenDialogSync(win, { properties: ['openDirectory'], title })?.pop();
  }

  chooseFile(win: BrowserWindow, title?: string) {
    return dialog.showOpenDialogSync(win, { properties: ['openFile'], title })?.pop();
  }

  executeCmd(cmd: string, options: any = {}) {
    const child = spawn(cmd, options);
    const { pid } = child;
    const { webContents } = this.activeWin;

    child.on('error', (error) => {
      webContents.send(IpcChannels.Api.CmdOutput, { pid, message: error });
    });

    child.on('close', (code) => {
      webContents.send(IpcChannels.Api.CmdOutput, { pid, code });
    });

    child.stdout.on('data', (data) => {
      webContents.send(IpcChannels.Api.CmdOutput, { pid, message: data.toString() });
    });

    child.stderr.on('data', (data) => {
      webContents.send(IpcChannels.Api.CmdOutput, { pid, message: data.toString() });
    });

    this.pids.push(pid);

    return pid;
  }

  exitCmd(pid: number) {
    const idx = this.pids.findIndex((cid) => cid === pid);

    if (idx >= 0) {
      const { webContents } = this.activeWin;
      webContents.send(IpcChannels.Api.CmdOutput, { pid, message: '\n>>>>>SIGTERM' });
      webContents.send(IpcChannels.Api.CmdOutput, { pid, message: '\n' });

      this.pids.splice(idx, 1);
    }
  }

  registerIpcListeners() {
    this.ipcMain.on(IpcChannels.Api.CmdRun, (event: IpcMainEvent, command: string, options?: any) => {
      event.returnValue = this.executeCmd(command, options);
    });

    this.ipcMain.on(IpcChannels.Api.CmdExit, (event: IpcMainEvent, pid: number) => {
      event.returnValue = this.exitCmd(pid);
    });

    this.ipcMain.on(IpcChannels.Api.OpenUrl, (_: IpcMainEvent, url: string, options = {}) => {
      shell.openExternal(url, options);
    });

    this.ipcMain.on(IpcChannels.Api.OpenPath, (_: IpcMainEvent, path: string) => {
      shell.openPath(path);
    });
  }
}
