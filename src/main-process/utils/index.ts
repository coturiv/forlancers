import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as mimeTypes from 'mime-types';

export const isDevMode = () => {
  const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
  const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV as string, 10) === 1;

  return isEnvSet ? getFromEnv : !app.isPackaged;
};

const args = process.argv.slice(1);
export const rootPath = path.resolve(app.getAppPath(), args.some((r) => r === '-r process') ? '..' : '');

export async function encodeFromFile(filePath: string): Promise<string> {
  if (!filePath) {
    throw new Error('filePath is required.');
  }
  let mediaType = mimeTypes.lookup(filePath);
  if (!mediaType) {
    throw new Error('Media type unreconized.');
  }
  const fileData = fs.readFileSync(filePath);
  mediaType = /\//.test(mediaType) ? mediaType : 'image/' + mediaType;
  const dataBase64 = Buffer.isBuffer(fileData) ? fileData.toString('base64') : Buffer.from(fileData).toString('base64');
  return 'data:' + mediaType + ';base64,' + dataBase64;
}

export const capitalize = (str: string) => {
  if (!str) {
    return '';
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const assetsPath = path.join(rootPath, isDevMode() ? 'public' : 'build', 'assets');
