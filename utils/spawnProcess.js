import { fork, spawn, exec } from 'child_process';
import { error } from 'console';

function startChildProccess(file, ...args) {
    const childProcess = spawn('node', [file, ...args]);

    childProcess.stdout.on('data', (data) => {
        console.log(`chProcess>>>${file.toString().slice(-10)}:::stdout:::${data}`);
    });

    childProcess.on('error', (err) => {
        console.log(`\nchProcess>>>${file.toString().slice(-10)}:::Error:::${err}`);
    });
    childProcess.on('close', (code, sig) => {
        console.log(`\nchProcess>>>${file.toString().slice(-10)}:::Closed:Code:::${code}:::Sig:::${sig}`);
    });
    return childProcess;
}

function npxStart(...args) {
    //console.log(/^win/.test(process.platform));
    const argsString = [...args].join(' ');
    //const childProcess = spawn('npx', ['electron', ...args], { stdio: 'inherit' });
    const childProcess = spawn('sh',['npx', 'electron', '../app/electron.js'], {stdio: 'inherit'});
    childProcess.on('error', err => console.log(err));
    return childProcess;
};

export { startChildProccess, npxStart };
