import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { EventEmitter } from 'events';
import path from 'path';
import { serializePayload } from '../core';
import { env } from './env';

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

    this.url = url;
    this.options = {
      webPreferences: {
        nodeIntegration: false,
        scrollBounce: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'web/preload.js'),
      },
    };
  }

  on(event: WindowEvents, callback: () => void) {
    super.on(event, callback);

    return this;
  }

  setOptions(options?: BrowserWindowConstructorOptions) {
    this.options = {
      ...this.options,
      ...options,
    };

    return this;
  }

  async open() {
    if (this.instance !== null) {
      if (!this.instance?.isVisible()) {
        this.show();
      }

      return;
    }

    await this.createAndOpen();
  }

  async toggle() {
    if (this.instance?.isVisible() === true) {
      this.hide();
    } else {
      await this.open();
    }
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

  sendEvent<T>(channel: string, payload?: T) {
    this.instance?.webContents.send(
      channel,
      payload != null ? serializePayload(payload) : undefined,
    );

    return this;
  }

  updateHeight(height: number) {
    const [width] = this.instance?.getSize() ?? [];

    if (width != null) {
      this.instance?.setSize(width, height, true);
    }

    return this;
  }

  private async createAndOpen() {
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

    await this.instance.loadURL(this.url);
    this.instance.show();
  }
}
