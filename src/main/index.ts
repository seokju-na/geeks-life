import { app, globalShortcut, ipcMain, nativeImage, nativeTheme, Tray } from 'electron';
import path from 'path';
import { ipcChannels } from '../core';
import { globalShortcuts, windowBackgroundColors } from './constants';
import { env } from './env';
import { Git } from './git';
import { Storage } from './storage';
import { encodePathAsUrl } from './util';
import { Window, WindowEvents } from './window';

const workspaceDir = path.resolve(app.getPath('userData'), 'workspace/');
const windowUrl = encodePathAsUrl(__dirname, 'web/index.html');

const storage = new Storage();
const git = new Git(workspaceDir);
let tray: Tray | null = null;
let window: Window | null = null;

type Theme = 'dark' | 'light';

async function bootstrap() {
  await storage.initialize();
  await git.init();
  await app.whenReady();

  const theme = storage.get<Theme>('theme') ?? (nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
  window = new Window(`${windowUrl}?theme=${theme}`);
  window.setOptions({
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: windowBackgroundColors[theme],
  });

  window.on(WindowEvents.Focus, () => {
    window?.sendEvent(ipcChannels.windowFocused);
  });

  window.on(WindowEvents.Blur, () => {
    if (env.prod) {
      window?.hide();
    }
  });

  tray = new Tray(nativeImage.createFromPath(encodePathAsUrl(__dirname, './assets/tray-icon.png')));
  tray.on('click', () => {
    window?.toggle();
  });

  app.on('window-all-closed', () => {
    if (!env.platform.darwin) {
      app.quit();
    }
  });

  /** Prevent links or window.open from opening new windows. */
  app.on('web-contents-created', (_, contents) => {
    contents.on('new-window', (event) => {
      event.preventDefault();
    });
  });

  globalShortcut.register(globalShortcuts.open, () => {
    window?.toggle();
  });

  ipcMain.on(ipcChannels.closeCurrentWindow, () => {
    window?.hide();
  });

  ipcMain.on(ipcChannels.commitRequest, () => {
    //
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
