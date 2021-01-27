import { BrowserWindow } from 'electron';
import { assetsPath, encodeFromFile } from '../utils';

interface SplashOptions {
  width?: number;
  height?: number;
  splashImage?: string;
  loadingText?: string;
  textColor?: string;
  textPercentageFromTop?: number;
  customHtml?: string;
  transparentWindow?: boolean;
  autoHideLaunchSplash?: boolean;
  showDuration?: number;
}

const defaultSplashOptions: SplashOptions = {
  width: 480,
  height: 480,
  splashImage: 'splash.png',
  loadingText: 'Initializing...',
  textColor: '#43A8FF',
  textPercentageFromTop: 92,
  transparentWindow: false,
  autoHideLaunchSplash: true,
  showDuration: 3000
};

export class SplashScreen {
  private static instance: SplashScreen;

  splashWin: BrowserWindow;

  static getInstance(splashOptions = {} as SplashOptions) {
    return this.instance || (this.instance = new this(Object.assign(defaultSplashOptions, splashOptions)));
  }

  private splashOptions: SplashOptions;

  constructor(splashOptions: SplashOptions) {
    this.splashOptions = Object.assign(defaultSplashOptions, splashOptions);
  }

  async create(beforeLaunch = () => {}) {
    this.splashWin = new BrowserWindow({
      width: this.splashOptions.width,
      height: this.splashOptions.height,
      frame: false,
      show: false,
      transparent: this.splashOptions.transparentWindow,
      webPreferences: {
        webSecurity: false
      }
    });

    const imagePath = `${assetsPath}/icons/${this.splashOptions.splashImage}`;
    let imageUrl = '';
    let useFallback = false;

    try {
      imageUrl = await encodeFromFile(imagePath);
    } catch (err) {
      useFallback = true;
      imageUrl = `./${this.splashOptions.splashImage}`;
    }

    const splashHtml =
      this.splashOptions.customHtml ||
      `
        <html style="width: 100%; height: 100%; margin: 0; overflow: hidden;">
            <body style="background-image: url('${imageUrl}');
                         background-position: center center;
                         background-repeat: no-repeat; width: 100%; height: 100%; margin: 0; overflow: hidden;">
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  color: ${this.splashOptions.textColor};
                                  position: absolute; top: ${this.splashOptions.textPercentageFromTop}%;
                                  text-align: left; padding-left: 12px; font-size: 14px; width: 100vw;">
                    ${this.splashOptions.loadingText}
                </div>
            </body>
        </html>
        `;

    if (useFallback) {
      this.splashWin.loadURL(`data:text/html;charset=UTF-8,${splashHtml}`, {
        baseURLForDataURL: `file://${assetsPath}/icons`
      });
    } else {
      this.splashWin.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(splashHtml)}`);
    }

    return await new Promise((resolve) => {
      this.splashWin.webContents.on('dom-ready', async () => {
        this.splashWin.show();

        beforeLaunch();

        setTimeout(() => resolve(true), this.splashOptions.showDuration);
      });
    });
  }

  show() {
    this.splashWin.show();
  }

  hide() {
    this.splashWin.hide();
  }

  close() {
    if (!this.splashWin.isDestroyed()) {
      this.splashWin.close();
    }
  }
}
