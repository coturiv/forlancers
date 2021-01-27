import { EventEmitter } from 'events';
import { IpcMain, ipcMain } from 'electron';

export abstract class IpcListener extends EventEmitter {
  protected ipcMain: IpcMain;

  abstract registerIpcListeners(): void;

  constructor() {
    super();
    this.ipcMain = ipcMain;

    this.registerIpcListeners();
  }
}
