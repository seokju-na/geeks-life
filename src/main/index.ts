import { app, BrowserWindow } from 'electron';

async function bootstrap() {
  await app.whenReady();

  // 브라우저 창을 생성합니다.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  win.loadFile('web/index.html');

  // 개발자 도구를 엽니다.
  win.webContents.openDevTools();
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
