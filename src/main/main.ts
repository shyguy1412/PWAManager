import * as path from 'path';
import { app, BrowserWindow, Menu, MenuItem } from 'electron';

//TEMP
const i18n = {
    t<T>(s: T) { return s }
}

function createMenu(): Menu {
    const menu = new Menu()

    menu.append(new MenuItem({
        label: i18n.t('Dev'),
        submenu: [
            {
                label: i18n.t('Toggle Developer Tools'),
                accelerator: 'ctrl+shift+i',
                click: () => { BrowserWindow.getFocusedWindow()!.webContents.toggleDevTools() }
            }, {
                label: i18n.t('Reload'),
                accelerator: 'f5',
                click: () => { BrowserWindow.getFocusedWindow()!.reload() }
            },
            {
                label: i18n.t('Exit'),
                accelerator: 'esc',
                click: () => { app.quit() }
            },
        ]

    }))

    return menu;
}

function createWindow() {

    // Create the browser window.
    const width = 1300;
    const height = 700;
    const mainWindow = new BrowserWindow({
        width: width,
        height: height,
        minWidth: width,
        minHeight: height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    if (process.env.DEV == 'true') {
        mainWindow.loadURL('http://localhost:3000');
    }
    else {
        mainWindow.loadFile(path.join(__dirname, 'index.html'));
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    return mainWindow;
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(async () => {
    Menu.setApplicationMenu(createMenu());
    createWindow();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
