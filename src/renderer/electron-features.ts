import { ipcRenderer, Menu, MenuItem } from 'electron';

declare global {
  interface Window {
    electronFeatures: {
      readonly ipcRenderer: typeof ipcRenderer;
      readonly Menu: typeof Menu;
      readonly MenuItem: typeof MenuItem;
    };
  }
}

export function getElectronFeatures() {
  return window.electronFeatures;
}
