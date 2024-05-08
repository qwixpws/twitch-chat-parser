import tmi from 'tmi.js';
//import electron from 'electron';
//import { createWindow, getApp } from './app/electron.js';
import { DateTime } from 'luxon';
import fs from 'fs';
import path from 'path';
import { npxStart } from './utils/spawnProcess.js';

//const { app } = electron;
//const appWindow = app.on('ready', createWindow);
const logsDir = path.join(process.cwd(), 'logs');
const appDir = path.join(process.cwd(), 'app', 'electron.js');

const appWindow = npxStart(appDir);
//appWindow.on('error', err => console.log(err));
appWindow.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

const client = new tmi.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    //channels: ['recrent']
    channels: ['striksy', 'tfblade', 'recrent', 'fiftyseven__']
});

client.connect();
client.on('message', (channel, tags, message, self) => {
    const channelName = channel.slice(1);
    const logFileName = `${channelName}-${DateTime.now().toFormat('dd.MM.yyyy')}.txt`;
    const logFilePath = path.join(logsDir, channelName, logFileName);
    const time = DateTime.fromMillis(parseInt(tags['tmi-sent-ts'])).toFormat('HH:mm:ss');

    if (self) return;

    if (!fs.existsSync(path.join(logsDir, channelName))) {
        fs.mkdirSync(path.join(logsDir, channelName), err => handleErr(err));
    }
    if (!fs.existsSync(path.join(logsDir, channelName, logFileName))) {
        fs.writeFile(path.join(logsDir, channelName, logFileName), '', {}, err => handleErr(err));
    }

    const data = `${time}::${tags.username}>>>>${message}\n`;
    //const data = `<div class='message'><span class='timestamp'>${time}</span>::<span class='user'>${tags.username}</span>>>>><span class='content'>${message}</span>\n</div>`;
    fs.appendFile(logFilePath, data, err => handleErr(err));

});

function handleErr(err) {
    if (err)
        console.log(`ERR:::fs:::${err}`);
}
