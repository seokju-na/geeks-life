import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import serve from 'electron-serve';
import { __DARWIN__ } from '~/main/utils/platform';

if (!isDev) {
  serve({
    directory: 'renderer/',
    scheme: 'geeks-life',
  });
}

async function bootstrap() {
  console.time('bootstrap');

  app.on('window-all-closed', () => {
    if (!__DARWIN__) {
      app.quit();
    }
  });

  await app.whenReady();

  const mainWindow = new BrowserWindow({
    width: 320,
    height: 480,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  await mainWindow.loadURL(isDev ? `http://localhost:3000` : 'geeks-life://./index.html');

  console.timeEnd('bootstrap');
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
