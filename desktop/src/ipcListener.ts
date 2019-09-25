import { ipcMain } from 'electron';
import * as os from 'os';

export class IpcListener {

    private static _instance: IpcListener;

    static get instance() {
        if (!IpcListener._instance) {
            IpcListener._instance = new IpcListener();
        }

        return IpcListener._instance;
    }


    static start() {
        const ipcListner = IpcListener.instance;

        ipcMain.on('record-start', () => {

        });

        ipcMain.on('record-stop', () => {
        });

        ipcMain.on('get-local-ip', (event, arg) => {
            event.returnValue = ipcListner.getLocalIP();
        });
    }

    // Get local IP address
    private getLocalIP() {
        const ifaces = os.networkInterfaces();

        let localIPs = [];

        Object.keys(ifaces)
              .map(ifname => {
                  console.log(ifname);
                  localIPs = localIPs.concat(ifaces[ifname].filter((iface: any) => iface.family === 'IPv4'
                                                                                && iface.internal === false
                                                                                && iface.address.startsWith('192.168.')));
              });

        return localIPs && localIPs[0].address ;


    }
}
