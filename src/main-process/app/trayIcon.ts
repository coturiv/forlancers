import { Tray, Menu, app } from 'electron';
import { assetsPath, capitalize } from '../utils';

interface TrayOptions {
  icon?: string;
  title?: string;
  toolTip?: string;
  onOpen: () => void;
  onQuit: () => void;
}

const defaultTrayOptions: Partial<TrayOptions> = {
  icon: 'tray.png'
};

export class TrayIcon {
  private static instance: TrayIcon;

  private tray: Tray;

  static getInstance(trayOptions = {} as TrayOptions) {
    return this.instance || (this.instance = new this(trayOptions));
  }

  constructor(trayOptions: TrayOptions) {
    trayOptions = Object.assign(defaultTrayOptions, trayOptions);

    const { onOpen, onQuit } = trayOptions;
    const contextMenu = Menu.buildFromTemplate([
      {
        label: `Open`,
        click: onOpen
      },
      {
        type: 'separator'
      },
      {
        label: `Quit`,
        click: onQuit
      }
    ]);

    const iconPath = `${assetsPath}/icons/${trayOptions.icon}`;
    this.tray = new Tray(iconPath);

    const title = trayOptions.title || capitalize(app.getName());
    const toolTip = trayOptions.toolTip || title;

    this.tray.on('click', (event) => {
      event.preventDefault();
      onOpen();
    });

    this.tray.setTitle(title);
    this.tray.setToolTip(toolTip);
    this.tray.setContextMenu(contextMenu);
  }
}
