import { BrowserWindow, shell, BrowserWindowConstructorOptions, IpcMainEvent } from 'electron';
import { isDevMode } from '../utils';
import { IpcListener } from '../helpers/ipcListener';
import { IpcChannels, WindowState } from '../../models/ipc-events';

interface MainWindowOptions extends BrowserWindowConstructorOptions {
  loadUrl: string;
  afterLoaded?: () => void;
  afterClosed?: () => void;
}

const defaultWinOptions: MainWindowOptions = {
  width: 1200,
  height: 768,
  minWidth: 800,
  minHeight: 480,
  show: false,
  frame: false,
  useContentSize: true,
  webPreferences: {
    nodeIntegration: true
  },
  loadUrl: ''
};

export class MainWindow extends IpcListener {
  private static instance: MainWindow;

  mainWin: BrowserWindow;

  static getInstance(winOptions = {} as MainWindowOptions) {
    return this.instance || (this.instance = new this(Object.assign(defaultWinOptions, winOptions)));
  }

  private winOptions: MainWindowOptions;

  constructor(winOptions: MainWindowOptions) {
    super();

    this.winOptions = winOptions;
  }

  create() {
    const { loadUrl, afterLoaded, afterClosed, ...options } = this.winOptions;

    if (!loadUrl) {
      return;
    }

    const win = new BrowserWindow(options);
    win.loadURL(loadUrl);

    if (typeof afterClosed === 'function') {
      afterClosed();
    }

    win.webContents.on('did-finish-load', () => {
      win.show();

      if (typeof afterLoaded === 'function') {
        afterLoaded();
      }
    });

    win.webContents.on('new-window', (e, url) => {
      e.preventDefault();
      shell.openExternal(url);
    });

    win.webContents.on('will-navigate', (e, url) => {
      e.preventDefault();
      shell.openExternal(url);
    });

    win.on('focus', () => {
      win.webContents.send(IpcChannels.Window.StateChanged, WindowState.Focused);
    });
    win.on('blur', () => {
      win.webContents.send(IpcChannels.Window.StateChanged, WindowState.Blurred);
    });
    win.on('maximize', () => {
      win.webContents.send(IpcChannels.Window.StateChanged, WindowState.Maximized);
    });
    win.on('unmaximize', () => {
      win.webContents.send(IpcChannels.Window.StateChanged, WindowState.Normal);
    });
    win.on('restore', () => {
      win.webContents.send(IpcChannels.Window.StateChanged, WindowState.Normal);
    });

    if (isDevMode()) {
      // win.webContents.openDevTools();
    }

    this.mainWin = win;
  }

  focus() {
    if (this.mainWin.isMinimized()) {
      this.mainWin.restore();
    }

    if (this.mainWin.isMaximized()) {
      this.mainWin.restore();
    }

    this.mainWin.focus();
  }

  registerIpcListeners() {
    this.ipcMain.on(IpcChannels.Window.Resize, (event: IpcMainEvent, width: number, height: number) => {
      const size = this.mainWin.getSize();

      width = width || size[0];
      height = height || size[1];

      this.mainWin.setSize(width, height);
    });

    this.ipcMain.on(IpcChannels.Window.Maximize, (event: IpcMainEvent) => {
      event.preventDefault();

      if (!this.mainWin.isMaximizable()) {
        return;
      }

      return !this.mainWin.isMaximized() ? this.mainWin.maximize() : this.mainWin.unmaximize();
    });

    this.ipcMain.on(IpcChannels.Window.Minimize, (event: IpcMainEvent) => {
      event.preventDefault();

      if (!this.mainWin.isMinimizable()) {
        return;
      }

      return !this.mainWin.isMinimized() ? this.mainWin.minimize() : this.mainWin.restore();
    });

    this.ipcMain.on(IpcChannels.Window.Close, () => {
      if (!this.mainWin.isClosable()) {
        return;
      }

      this.mainWin.close();
    });
  }
}
