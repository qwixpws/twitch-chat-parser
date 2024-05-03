import tmi from 'tmi.js';

const client = new tmi.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['striksy']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	if(self) return;

	if(message.toLowerCase() === '!hello') {
		// "@alca, heya!"
		console.log(channel, `@${tags.username}, heya!`);
	}
});
				
