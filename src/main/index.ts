import { app, globalShortcut, ipcMain, nativeImage, nativeTheme, Tray } from 'electron';
import path from 'path';
import {
  CommitDailyLifeErrorCode,
  CommitDailyLifeRequest,
  CommitDailyLifeResponse,
  EmojiResponse,
  GitUserConfigSetRequest,
  GitUserConfigSetResponse,
  ipcChannels,
  LoadDailyLifeModifiedFlagRequest,
  LoadDailyLifeModifiedFlagResponse,
  LoadDailyLifeRequest,
  LoadDailyLifeResponse,
  parsePayload,
  SaveDailyLifeRequest,
  serializePayload,
} from '../core';
import { sort, SortingType } from '../core/sorting';
import { globalShortcuts, windowBackgroundColors } from './constants';
import { env } from './env';
import { DailyLogService, EmojiService, GitService } from './services';
import { Storage } from './storage';
import { encodePathAsUrl } from './util';
import { Window, WindowEvents } from './window';

const windowUrl = encodePathAsUrl(__dirname, 'web/index.html');
const workspaceUrl = path.join(app.getPath('userData'), 'workspace/');

const storage = new Storage();
const emojiService = new EmojiService();
const gitService = new GitService();
const dailyLogService = new DailyLogService(workspaceUrl, [gitService]);
let tray: Tray | null = null;
let window: Window | null = null;
let willQuit = false;

type Theme = 'dark' | 'light';

async function bootstrap() {
  console.time('bootstrap');

  await Promise.all([storage.initialize(), dailyLogService.initialize()]);
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

  app.on('before-quit', async (event) => {
    if (willQuit) {
      return;
    }

    event.preventDefault();

    await Promise.all([storage.destroy()]);
    willQuit = true;
    app.quit();
  });

  globalShortcut.register(globalShortcuts.open, () => {
    window?.toggle();
  });

  ipcMain.on(ipcChannels.closeCurrentWindow, () => {
    window?.hide();
  });

  ipcMain.on(ipcChannels.emojiRequest, async (event) => {
    const { native } = await emojiService.readEmojis();
    const emojis = [...native];

    sort(emojis, SortingType.Asc, (emoji) => emoji.key);

    const payload: EmojiResponse = {
      emojis,
    };

    event.reply(ipcChannels.emojiResponse, serializePayload(payload));
  });

  ipcMain.on(ipcChannels.loadDailyLifeModifiedFlagRequest, async (_, arg) => {
    const requestPayload = parsePayload<LoadDailyLifeModifiedFlagRequest>(arg);

    if (requestPayload == null) {
      return;
    }

    const modified = await dailyLogService.getDailyLifeModifiedFlag(requestPayload.date);
    const responsePayload: LoadDailyLifeModifiedFlagResponse = {
      modified,
    };

    window?.sendEvent(ipcChannels.loadDailyLifeModifiedFlagResponse, responsePayload);
  });

  ipcMain.on(ipcChannels.loadDailyLifeRequest, async (_, arg) => {
    const requestPayload = parsePayload<LoadDailyLifeRequest>(arg);

    if (requestPayload?.type === 'week') {
      const responsePayload: LoadDailyLifeResponse = {
        type: 'week',
        dailyLives: await dailyLogService.getDailyLifeByWeek(requestPayload.date),
      };

      window?.sendEvent(ipcChannels.loadDailyLifeResponse, responsePayload);
    } else if (requestPayload?.type === 'month') {
      const responsePayload: LoadDailyLifeResponse = {
        type: 'month',
        dailyLives: await dailyLogService.getDailyLifeByMonth(requestPayload.date),
      };

      window?.sendEvent(ipcChannels.loadDailyLifeResponse, responsePayload);
    }
  });

  ipcMain.on(ipcChannels.saveDailyLifeRequest, async (_, arg) => {
    const payload = parsePayload<SaveDailyLifeRequest>(arg);

    if (payload == null) {
      return;
    }

    await dailyLogService.saveDailyLife(payload.date, payload.dailyLife);

    window?.sendEvent(ipcChannels.saveDailyLifeResponse);
  });

  ipcMain.on(ipcChannels.commitDailyLifeRequest, async (_, arg) => {
    const requestPayload = parsePayload<CommitDailyLifeRequest>(arg);
    if (requestPayload == null) {
      return;
    }
    let sha: string | undefined = undefined;
    let errorCode: CommitDailyLifeErrorCode | undefined = undefined;

    try {
      sha = await dailyLogService.commitDailyFile(requestPayload.date);
    } catch (error) {
      errorCode = error?.code;
    }

    const responsePayload: CommitDailyLifeResponse = {
      date: requestPayload.date,
      sha,
      errorCode,
    };

    window?.sendEvent(ipcChannels.commitDailyLifeResponse, responsePayload);
  });

  ipcMain.on(ipcChannels.gitUserConfigSetRequest, async (_, arg) => {
    const requestPayload = parsePayload<GitUserConfigSetRequest>(arg);
    if (requestPayload == null) {
      return;
    }

    let errorCode: string | undefined = undefined;

    try {
      await gitService.setUserConfig(workspaceUrl, requestPayload.name, requestPayload.email);
    } catch (error) {
      errorCode = error?.code;
    }

    const responsePayload: GitUserConfigSetResponse = {
      errorCode,
    };

    window?.sendEvent(ipcChannels.gitUserConfigSetResponse, responsePayload);
  });

  console.timeEnd('bootstrap');
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
