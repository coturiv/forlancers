import { DesktopCapturer, Remote, RendererInterface } from 'electron';
import { Injectable } from '@angular/core';


declare let window: any;

@Injectable({
    providedIn: 'root'
})
export class ElectronRef {

    private _electron: RendererInterface;

    private get electron(): RendererInterface {

        if (!this._electron) {
            try {
                this._electron = window.require && window.require('electron');
            } catch (e) {
                return null;
            }
        }

        return this._electron;
    }

    // IpcRenderer
    get ipc() {
        return this.electron && this.electron.ipcRenderer;
    }

    // DesktopCapturer
    get desktopCapturer(): DesktopCapturer {
        return this.electron && this.electron.desktopCapturer;
    }

    // Remote
    get remote(): Remote {
        return this.electron && this.electron.remote;
    }

    /**
     *  display Desktop Notification
     *
     * @param title: string
     * @param message: string
     * @param onClick: void
     */
    openNotify(title: string, message: string, onClick?: () => void) {
        const notification = new Notification(title, {
            body: message
        });

        notification.onclick = onClick;
    }

    /**
     * display a progress bar to a taskbar button/ or dock icon
     *
     * @param value: number (0 ~ 1)
     */
    setProgressBar(value: number) {

        if (this.ipc) {
            this.ipc.send('set-progressbar', value);
        }
    }

    checkForUpdates() {

    }

    getIpAddress() {
        return this.ipc.sendSync('get-local-ip');
    }

    resizeWindow(width: number, height: number) {
        if (this.ipc) {
            this.ipc.send('resize-window', width, height);
        }
    }

}

