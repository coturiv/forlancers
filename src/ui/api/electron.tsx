import { IpcRenderer, IpcRendererEvent } from 'electron';
import type Electron from 'electron';

import { loadPackage } from '../utils';

type ElectronRef = typeof Electron;

export class ElectronApi {
  private electron: ElectronRef;
  private ipc: IpcRenderer;

  private static instance: ElectronApi;

  static getInstance() {
    return this.instance || (this.instance = new this());
  }

  constructor() {
    this.electron = loadPackage<ElectronRef>('electron') as ElectronRef;
    this.ipc = this.electron?.ipcRenderer as IpcRenderer;
  }

  listenIpc(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
    this.ipc?.on(channel, listener);
  }

  send(channel: string, ...args: any[]) {
    this.ipc?.send(channel, ...args);
  }

  sendSync<T>(channel: string, ...args: any[]): T {
    return this.ipc?.sendSync(channel, ...args);
  }
}
