import { ipcRenderer } from 'electron';

declare global {
  interface Window {
    electronFeatures?: {
      readonly ipcRenderer: typeof ipcRenderer;
    };
  }
}
