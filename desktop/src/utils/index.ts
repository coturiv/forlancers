import { app } from 'electron';
import * as electronIsDev from 'electron-is-dev';

// Get Application Path
export const appPath = app.getAppPath();

export const isDevMode = electronIsDev;
