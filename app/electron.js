import electron from 'electron';
import url from 'url';
import path from 'path';
import fs from 'fs';
//const path = require('path');
//const url = require('url');
//const electron = require('electron');
const appDir = path.join(process.cwd(), 'app');
const logDir = path.join(process.cwd(), 'logs');
const channelName = 'tfblade';
const logFile = path.join(logDir, channelName, 'renderHTML.html');

let mainWindow;

function createWindow() {
    mainWindow = new electron.BrowserWindow({
        width: 600,
        height: 600,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeInegration: true,
        },
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(appDir, 'app.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    mainWindow.setPosition(0, 0, true);

    setInterval(() => {
        getFileLines(logFile)
    }, 1000);
}

function getApp() {
    const app = electron.app.on('ready', createWindow);
    //app.on('error',err = console.log(err));
    app.on('window-all-closed', function() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    return app
}

function tail(filePath, linesCount) {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n').reverse();
    return lines.slice(0, linesCount).reverse().join('\n');
}

function getFileLines(log) {
    const logFile = log;
    const content = tail(logFile, 15);
    //mainWindow.ipcRenderer.send('fileupdated', content);
    mainWindow.webContents.executeJavaScript(`
            document.getElementById('chat').innerHTML= ${JSON.stringify(content)};
        `);
    return content;
}

getApp();

export { createWindow, getApp } 
