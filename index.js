import tmi from 'tmi.js';
import { DateTime } from 'luxon';
import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

const client = new tmi.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['striksy', 'tfblade']
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
    fs.appendFile(logFilePath, data, err => handleErr(err));

    if (message.toLowerCase() === '!hello') {
        // "@alca, heya!"
        console.log(channel, `@${tags.username}, heya!`);
    }
});

function handleErr(err) {
    if (err)
        console.log(`ERR:::fs:::${err}`);
}
