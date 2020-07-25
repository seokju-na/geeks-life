import { app, globalShortcut, ipcMain, nativeImage, nativeTheme, Tray } from 'electron';
import { EmojiResponse, ipcChannels, serializePayload } from '../core';
import { sort, SortingType } from '../core/sorting';
import { globalShortcuts, windowBackgroundColors } from './constants';
import { env } from './env';
import { EmojiService } from './services';
import { Storage } from './storage';
import { encodePathAsUrl } from './util';
import { Window, WindowEvents } from './window';

const windowUrl = encodePathAsUrl(__dirname, 'web/index.html');

const storage = new Storage();
const emojiManager = new EmojiService();
let tray: Tray | null = null;
let window: Window | null = null;

type Theme = 'dark' | 'light';

async function bootstrap() {
  console.time('bootstrap');

  await storage.initialize();
  await app.whenReady();

  const theme = storage.get<Theme>('theme') ?? (nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
  window = new Window(`${windowUrl}?theme=${theme}`);
  window.setOptions({
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: windowBackgroundColors[theme],
    width: 320,
    height: 480,
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

  ipcMain.on(ipcChannels.emojiRequest, async (event) => {
    const { native } = await emojiManager.readEmojis();
    const emojis = [...native];

    sort(emojis, SortingType.Asc, (emoji) => emoji.key);

    const payload: EmojiResponse = {
      emojis,
    };

    event.reply(ipcChannels.emojiResponse, serializePayload(payload));
  });

  console.timeEnd('bootstrap');
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
