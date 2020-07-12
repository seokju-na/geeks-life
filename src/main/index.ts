import { app, globalShortcut, nativeImage, nativeTheme, Tray } from 'electron';
import { globalShortcuts, windowBackgroundColors } from './constants';
import { env } from './env';
import { Storage } from './storage';
import { encodePathAsUrl } from './util';
import { Window, WindowEvents } from './window';

const storage = new Storage();
let tray: Tray | null = null;
const window = new Window('web/index.html');

type Theme = 'dark' | 'light';

async function bootstrap() {
  await storage.initialize();
  await app.whenReady();

  app.dock.hide();

  const theme = storage.get<Theme>('theme') ?? (nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
  window.extendOptions({
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    // titleBarStyle: 'hidden',
    backgroundColor: windowBackgroundColors[theme],
  });

  window.on(WindowEvents.Blur, () => {
    window.hide();
  });

  tray = new Tray(nativeImage.createFromPath(encodePathAsUrl(__dirname, './assets/tray-icon.png')));
  tray.on('click', () => {
    window.open();
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
    window.open();
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
