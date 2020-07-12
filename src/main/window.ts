import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { EventEmitter } from 'events';
import path from 'path';
import { env } from './env';
import { encodePathAsUrl } from './util';

export enum WindowEvents {
  Closed = 'window.closed',
  Focus = 'window.focus',
  Blur = 'window.blur',
}

export class Window extends EventEmitter {
  private instance: BrowserWindow | null = null;
  private options: BrowserWindowConstructorOptions;
  readonly url: string;

  constructor(url: string) {
    super();

    this.url = encodePathAsUrl(__dirname, url);
    this.options = {
      webPreferences: {
        preload: path.join(__dirname, 'web/preload.js'),
      },
    };
  }

  on(event: WindowEvents, callback: () => void) {
    super.on(event, callback);

    return this;
  }

  extendOptions(options?: BrowserWindowConstructorOptions) {
    this.options = {
      ...this.options,
      ...options,
    };

    return this;
  }

  async open() {
    if (this.instance !== null && this.hide()) {
      this.show();
      return;
    }

    this.createWindowInstance();
    await this.instance?.loadURL(this.url);
    this.instance?.show();
  }

  show() {
    this.instance?.show();
  }

  hide() {
    this.instance?.hide();
  }

  close() {
    this.instance?.close();
    this.instance = null;
  }

  private createWindowInstance() {
    if (this.instance !== null) {
      return;
    }

    this.instance = new BrowserWindow(this.options);
    this.instance.on('closed', () => {
      this.emit(WindowEvents.Closed);
      this.instance = null;
    });

    this.instance.on('focus', () => {
      this.emit(WindowEvents.Focus);
    });

    this.instance.on('blur', () => {
      this.emit(WindowEvents.Blur);
    });

    this.instance.webContents.on('did-finish-load', () => {
      if (env.prod) {
        this.instance?.webContents.setVisualZoomLevelLimits(1, 1);
      }
    });
  }
}
