import { app, Menu, Tray, ipcMain } from 'electron';
import { MainWindow } from './mainWindow';

export interface TrayOptions {
    icon: string;
    title?: string;
    toolTip?: string;
}

export class TrayIcon {

    static get instance() {
        if (!TrayIcon._instance) {
            TrayIcon._instance = new TrayIcon();
        }

        return TrayIcon._instance;
    }

    private static _instance: TrayIcon;

    private tray: Tray;

    static create(mainWin: MainWindow, trayOptions: TrayOptions) {
        const instance = TrayIcon.instance;

        if (instance.tray) {
            return instance;
        }

        const contextMenu = Menu.buildFromTemplate([{
                label: 'Open ionic4-electron-starter',
                click: () => {
                    mainWin.winRef.show();
                }
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                click: () => {
                    mainWin.allowClosing = true;
                    app.quit();
                }
            }
        ]);

        const tray = new Tray(trayOptions.icon);

        // popup main window by clicking tray icon
        tray.on('click', (event) => {
            event.preventDefault();
            mainWin.showWindow();
        });

        tray.setTitle(trayOptions.title || '');
        tray.setToolTip(trayOptions.toolTip);
        tray.setContextMenu(contextMenu);

        instance.tray = tray;

        instance.handleTrayEvents();

        return instance;

    }

    /**
     * handle all tray events
     */
    handleTrayEvents() {

        ipcMain.on('tray-change-title', (_, title) => {
            this.tray.setTitle(title);
        });

        ipcMain.on('tray-change-tooltip', (_, toolTip: string) => {
            this.tray.setToolTip(toolTip);
        });

        ipcMain.on('tray-change-icon', () => {
            // this.tray.setImage()
        });
    }
}
