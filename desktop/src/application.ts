import { app } from 'electron';

import { MainWindow } from './mainWindow';
import { TrayIcon } from './trayIcon';
import { SplashScreen } from './splashScreen';
import { IpcListener } from './ipcListener';
import { appPath } from './utils';


let mainWin: MainWindow;

let splashScreen: SplashScreen;

let trayIcon: TrayIcon;

export class Application {

    static get instance() {
        if (!Application._instance) {
            Application._instance = new Application();
        }

        return Application._instance;
    }

    private static _instance: Application;

    private appConfig: any;


    static startWithConfig(config: any = {}) {
        const instance = Application.instance;

        instance.appConfig = config;


        // makeSingleInstance
        const gotTheLock = app.requestSingleInstanceLock();
        if (!gotTheLock) {
            return app.quit();
        }

        app.on('ready', () => {
            mainWin = instance.createWindow();

            if (mainWin) {

                // create TrayIcon
                if (!trayIcon) {
                    trayIcon = TrayIcon.create(mainWin, {
                        icon: `${appPath}/resources/icon/16x16.png`,
                        toolTip: `${app.getName()} ${app.getVersion()}`
                    });
                }
            }
        });

        // Quit when all windows are closed.
        app.on('window-all-closed', () => {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWin === null) {
                mainWin = instance.createWindow();
            } else {
                mainWin.showWindow();
            }
        });

        app.on('second-instance', (event, commandLine, workingDirectory) => {

            // Someone tried to run a second instance, we should focus our window.
            if (mainWin) {
                mainWin.focusWindow();
            }
        });


        // Listen ipc events
        IpcListener.start();
    }


    /**
     * Update application configuration
     */
    updateConfig(appConfig: any) {
        this.appConfig = appConfig;
    }

    /**
     * Create window
     */
    createWindow() {
        const win = MainWindow.create();

        const args = process.argv.slice(1);
        const serve: boolean = args.some(val => val === '--serve');

        if (serve) {
            win.loadURL('http://localhost:4200').then(_ => {
                win.showWindow();
            });
        } else {
            if (this.appConfig.useSplashScreen) {
                splashScreen = SplashScreen.create();
            }

            win.loadURL(`file://${appPath}/www/index.html`).then(async _ => {
                if (splashScreen) {
                    const splashOptions = splashScreen.splashOptions;

                    if (splashOptions.showDuration) {
                        await new Promise(resolve => setTimeout(resolve, splashOptions.showDuration));
                    }

                    splashScreen.hide();
                }

                win.showWindow();
            });
        }

        return win;
    }

}
