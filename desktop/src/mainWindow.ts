import { BrowserWindow, ipcMain } from 'electron';
import { appPath, isDevMode } from './utils';

export class MainWindow {

    private static _instance: MainWindow;

    static get instance() {
        if (!MainWindow._instance) {
            MainWindow._instance = new MainWindow();
        }

        return MainWindow._instance;
    }

    allowClosing: boolean;

    private _winRef: BrowserWindow;

    get winRef(): BrowserWindow {
        return this._winRef;
    }

    set winRef(win: BrowserWindow) {
        this._winRef = win;
    }

    static create() {
        const options = {
            height: 600,
            width: 400,
            minWidth: 400,
            show: false,
            resizable: true,
            icon: `${appPath}/resources/icon/icon.icon`,
            webPreferences: {
              nodeIntegration: true
            }
        };

        const instance = MainWindow.instance;
        const mainWin = new BrowserWindow(options);

        // remove menu on production
        if (!isDevMode) {
            mainWin.setMenu(null);
        }

        instance.winRef = mainWin;

        instance.handleWindowEvents();

        return instance;
    }

    loadURL(url: string) {
        if (this._winRef) {
            this._winRef.loadURL(url);

            return new Promise(resolve => {
                this._winRef.webContents.on('dom-ready', () => {
                    resolve();
                });
            });
        }
    }

    showWindow() {
        this._winRef.show();
    }

    focusWindow() {
        if (this._winRef.isMinimized()) {
            this._winRef.restore();
        }

        this._winRef.focus();
    }

    hideWindow() {
        this._winRef.hide();
    }

    setWindowTitle(title: string) {

    }

    setWindowSize(width: number, height: number) {
        this._winRef.setSize(width, height);
    }

    setProgressBar(value: number) {
        this._winRef.setProgressBar(value);
    }

    handleWindowEvents() {
        this._winRef.on('close', (event: any) => {
            if (!this.allowClosing) {
                event.preventDefault();
                this._winRef.hide();
            }
        });

        ipcMain.on('resize-window', (event, width, height) => {
            event.preventDefault();
            this.setWindowSize(width, height);
        });

        ipcMain.on('set-progressbar', (event, value) => {
            event.preventDefault();
            this.setProgressBar(value);
        });

    }
}
