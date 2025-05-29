// This file defines the model for managing blacklisted URLs in the application.

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const startClientScript = path.join(__dirname, 'start-client.sh');
if (fs.existsSync(startClientScript)) {
    exec(`bash ${startClientScript}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Script error output: ${stderr}`);
            return;
        }
        console.log(`Script output: ${stdout}`);
    });
}

// Start the client script as a persistent process
const clientProcess = spawn('bash', [startClientScript], {
    stdio: ['pipe', 'pipe', 'pipe']
});

// Helper to send a command and get a response from the client process
function sendCommand(command) {
    return new Promise((resolve, reject) => {
        let data = '';
        let error = '';
        const onData = (chunk) => {
            data += chunk.toString();
            if (data.endsWith('\n')) {
                clientProcess.stdout.off('data', onData);
                resolve(data.trim());
            }
        };
        const onError = (chunk) => {
            error += chunk.toString();
        };
        clientProcess.stdout.on('data', onData);
        clientProcess.stderr.once('data', onError);
        clientProcess.stdin.write(command + '\n');
    });
}

const deleteFromBlacklist = (id) => {
    return sendCommand(`DELETE ${id}`);
};

const getBlacklistedURLById = (id) => {
    return sendCommand(`GET ${id}`);
};

const createBlacklistedURL = (id) => {
    return sendCommand(`POST ${id}`);
};

module.exports= { deleteFromBlacklist, getBlacklistedURLById, createBlacklistedURL };
