import { BrowserWindow } from 'electron';
import { appPath } from './utils';

interface SplashOptions {
    imageFileName?: string;
    width?: number;
    height?: number;
    textColor?: string;
    loadingText?: string;
    textPercentageFromTop?: number;
    transparentWindow?: boolean;
    autoHideLaunchSplash?: boolean;
    customHtml?: boolean;
    showDuration?: number;
}

// ref: @capacitor/splash
export class SplashScreen {

    static get instance() {
        if (!SplashScreen._instance) {
            SplashScreen._instance = new SplashScreen();
        }

        return SplashScreen._instance;
    }

    private static _instance: SplashScreen;

    private _splashWin: BrowserWindow;

    private _splashOptions: SplashOptions = {
        imageFileName: 'splash.png',
        width: 400,
        height: 400,
        textColor: '#43A8FF',
        loadingText: 'Loading...',
        textPercentageFromTop: 75,
        transparentWindow: false,
        autoHideLaunchSplash: true,
        customHtml: false,
        showDuration: 3000
    };

    get splashWin(): BrowserWindow {
        return this._splashWin;
    }

    set splashWin(win: BrowserWindow) {
        this._splashWin = win;
    }

    get splashOptions(): SplashOptions {
        return this._splashOptions;
    }

    static create(splashOptions: SplashOptions = {}) {
        const instance = SplashScreen.instance;

        splashOptions = Object.assign(instance._splashOptions, splashOptions);

        const splashHtml = `
            <html style="width: 100%; height: 100%; margin: 0; overflow: hidden;">
                <body style="background-image: url('./${splashOptions.imageFileName}'); background-position: center center;
                    background-repeat: no-repeat; width: 100%; height: 100%; margin: 0; overflow: hidden;">
                <div style="font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: ${splashOptions.textColor};
                    position: absolute; top: ${splashOptions.textPercentageFromTop}%; text-align: center; font-size: 10vw; width: 100vw;>
                        ${splashOptions.loadingText}
                </div>
                </body>
            </html>
            `;

        const splashWin = new BrowserWindow({
            width: splashOptions.width,
            height: splashOptions.height,
            frame: false,
            show: false,
            transparent: splashOptions.transparentWindow,
        });

        splashWin.loadURL(`data:text/html;charset=UTF-8,${splashHtml}`, {baseURLForDataURL: `file://${appPath}/resources/splash/`});

        splashWin.webContents.on('dom-ready', () => {
            splashWin.show();
        });

        instance._splashOptions = splashOptions;
        instance.splashWin = splashWin;

        return instance;
    }

    show() {
        if (this.splashWin) {
            this.splashWin.show();
        }
    }

    hide() {
        if (this.splashWin) {
            this.splashWin.hide();
        }
    }

    close() {
        if (this.splashWin) {
            this.splashWin.close();
        }
    }
}
