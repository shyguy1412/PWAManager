import * as path from 'path';
import { app, BrowserWindow, Menu, MenuItem } from 'electron';

//TEMP
const i18n = {
    t<T>(s: T) { return s; }
};

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
            nodeIntegration: false,
            sandbox: true
        },
    });

    console.log(process.argv);

    mainWindow.loadURL(process.argv[1]);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

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
