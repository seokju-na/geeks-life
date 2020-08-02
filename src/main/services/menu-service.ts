import { BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions, shell } from 'electron';
import { ipcChannels, MenuMessage, MenuMessagePayload, serializePayload } from '../../core';
import { env } from '../env';

interface Menus {
  readonly main: MenuItemConstructorOptions;
  readonly file: MenuItemConstructorOptions;
  readonly edit: MenuItemConstructorOptions;
  readonly view: MenuItemConstructorOptions;
  readonly window: MenuItemConstructorOptions;
  readonly help: MenuItemConstructorOptions;
}

const menuItemIds = {
  file: 'file',
  'file.newLog': 'file-new-log',
  'file.editLog': 'file-edit-log',
  'file.deleteLog': 'file-delete-log',
  'file.commitChanges': 'file-commit-changes',
} as const;

export class MenuService {
  initialize() {
    this.setDefaultMenu();
  }

  setDefaultMenu() {
    const defaultMenus = this.createDefaultMenus();
    const menu = Menu.buildFromTemplate(this.concatMenuAsTemplate(defaultMenus));

    Menu.setApplicationMenu(menu);

    return this;
  }

  updateView(view: 'weekly' | 'monthly') {
    const fileMenu = this.getFileMenu();
    const newLogMenu = fileMenu?.submenu?.items.find(
      (item) => item.id === menuItemIds['file.newLog'],
    );
    const commitChangesMenu = fileMenu?.submenu?.items.find(
      (item) => item.id === menuItemIds['file.commitChanges'],
    );

    if (newLogMenu != null) {
      newLogMenu.visible = view !== 'monthly';
    }
    if (commitChangesMenu != null) {
      commitChangesMenu.visible = view !== 'monthly';
    }

    return this;
  }

  updateCommitChangesFlag(enabled: boolean) {
    const fileMenu = this.getFileMenu();
    const commitChangesMenu = fileMenu?.submenu?.items.find(
      (item) => item.id === menuItemIds['file.commitChanges'],
    );

    if (commitChangesMenu != null) {
      commitChangesMenu.enabled = enabled;
    }

    return this;
  }

  updateLogMenu(focused: boolean) {
    const fileMenu = this.getFileMenu();
    const editLogMenu = fileMenu?.submenu?.items.find(
      (item) => item.id === menuItemIds['file.editLog'],
    );
    const deleteLogMenu = fileMenu?.submenu?.items.find(
      (item) => item.id === menuItemIds['file.deleteLog'],
    );

    if (editLogMenu != null) {
      editLogMenu.visible = focused;
    }
    if (deleteLogMenu != null) {
      deleteLogMenu.visible = focused;
    }

    return this;
  }

  private getFileMenu() {
    const menu = Menu.getApplicationMenu();

    return menu?.items.find((item) => item.id === menuItemIds.file);
  }

  /**
   * macOS:
   * | Geeks Life | File | Edit | View | Window | Help |
   */
  private createDefaultMenus(): Menus {
    const separator: MenuItemConstructorOptions = { type: 'separator' };

    const sendMessageOnClick = (message: MenuMessage) => (_: MenuItem, window?: BrowserWindow) => {
      window?.webContents.send(
        ipcChannels.menu,
        serializePayload<MenuMessagePayload>({
          message,
        }),
      );
    };

    const mainMenu: MenuItemConstructorOptions = {
      label: env.productName,
      submenu: [
        {
          label: `About ${env.productName}`,
          id: 'about',
          click: sendMessageOnClick(MenuMessage.ShowAbout),
        },
        // separator,
        // {
        //   label: 'Preferences…',
        //   id: 'preferences',
        //   accelerator: 'CmdOrCtrl+,',
        //   click: sendMessageOnClick('showSettings'),
        // },
        separator,
        {
          role: 'services',
        },
        separator,
        { role: 'hide' },
        // NOTE: electron type does not matches
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { role: 'hideothers' as any },
        { role: 'unhide' },
        separator,
        { role: 'quit' },
      ],
    };

    const fileMenu: MenuItemConstructorOptions = {
      id: menuItemIds.file,
      label: 'File',
      submenu: [
        {
          label: 'New Log',
          id: menuItemIds['file.newLog'],
          accelerator: 'CmdOrCtrl+N',
          click: sendMessageOnClick(MenuMessage.NewDailyLifeLog),
          visible: true,
        },
        {
          label: 'Edit Log',
          id: menuItemIds['file.editLog'],
          accelerator: 'CmdOrCtrl+E',
          click: sendMessageOnClick(MenuMessage.EditDailyLifeLog),
          visible: false,
        },
        {
          label: 'Delete Log',
          id: menuItemIds['file.deleteLog'],
          accelerator: 'Backspace',
          click: sendMessageOnClick(MenuMessage.DeleteDailyLifeLog),
          visible: false,
        },
        {
          label: 'Commit Changes',
          id: menuItemIds['file.commitChanges'],
          accelerator: 'CmdOrCtrl+S',
          click: sendMessageOnClick(MenuMessage.CommitDailyLifeChanges),
          visible: true,
          enabled: false,
        },
        separator,
        {
          role: env.platform.darwin ? 'close' : 'quit',
        },
      ],
    };

    const editMenu: MenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        separator,
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        {
          role: 'selectAll',
        },
      ],
    };

    const viewMenu: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          id: 'show-weekly-view',
          label: 'Weekly View',
          accelerator: 'CmdOrCtrl+1',
          click: sendMessageOnClick(MenuMessage.WeeklyView),
        },
        {
          id: 'show-monthly-view',
          label: 'Monthly View',
          accelerator: 'CmdOrCtrl+2',
          click: sendMessageOnClick(MenuMessage.MonthlyView),
        },
        separator,
        {
          id: 'show-devtools',
          label: 'Toggle Developer Tools',
          accelerator: env.platform.darwin ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click(_, focusedWindow) {
            focusedWindow?.webContents.toggleDevTools();
          },
        },
      ],
    };

    if (!env.prod) {
      (viewMenu.submenu as MenuItemConstructorOptions[]).push(separator, { role: 'reload' });
    }

    const windowMenu: MenuItemConstructorOptions = {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' },
        separator,
        { role: 'front' },
      ],
    };

    const helpMenu: MenuItemConstructorOptions = {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://github.com/seokju-na/geeks-life');
          },
        },
      ],
    };

    return {
      main: mainMenu,
      file: fileMenu,
      edit: editMenu,
      view: viewMenu,
      window: windowMenu,
      help: helpMenu,
    };
  }

  private concatMenuAsTemplate(menus: Menus) {
    const template: MenuItemConstructorOptions[] = [];

    if (env.platform.darwin) {
      template.push(menus.main);
    }
    template.push(menus.file);
    template.push(menus.edit);
    template.push(menus.view);
    template.push(menus.window);
    if (env.platform.darwin) {
      template.push(menus.help);
    }

    return template;
  }
}
