import * as path from 'path';
import { app, BrowserWindow, Menu } from 'electron';
import { ipcMain } from 'electron/main';
import { readFile, writeFile } from 'fs/promises';

const appDataPath = app.getPath('userData');
const SHORTCUTS_FILE = `${appDataPath}/shortcuts.json`;

function createWindow() {

    // Create the browser window.
    const width = 800;
    const height = 600;
    const mainWindow = new BrowserWindow({
        width: width,
        height: height,
        minWidth: width,
        minHeight: height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            sandbox: true
        },
    });

    mainWindow.loadFile('./index.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    return mainWindow;
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(async () => {
    Menu.setApplicationMenu(null);
    createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


ipcMain.handle('load-url', (e, url) => {
    BrowserWindow.getAllWindows()[0].loadURL(url);
});

ipcMain.handle('load-shortcuts', async () => {
    const file = await readFile(SHORTCUTS_FILE, { encoding: 'utf8' }).catch(_ => null);
    if (!file) return {};
    return JSON.parse(file);
});

ipcMain.handle('add-shortcut', async (_, name, url) => {
    const file = await readFile(SHORTCUTS_FILE, { encoding: 'utf8' }).catch(_ => null);
    const shortcuts = file ? JSON.parse(file) : {};
    shortcuts[name] = url;

    await writeFile(SHORTCUTS_FILE, JSON.stringify(shortcuts));
});


ipcMain.handle('remove-shortcut', async (_, name) => {
    const file = await readFile(SHORTCUTS_FILE, { encoding: 'utf8' }).catch(_ => null);
    const shortcuts = file ? JSON.parse(file) : {};
    delete shortcuts[name];

    await writeFile(SHORTCUTS_FILE, JSON.stringify(shortcuts));
});
