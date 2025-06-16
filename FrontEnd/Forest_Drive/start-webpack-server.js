const { spawn } = require('child_process');
const path = require('path');

function startWebpackServer() {
    return new Promise((resolve, reject) => {
        const webpackPath = path.resolve(__dirname, '../../');
        
        // Start webpack dev server
        const webpackProcess = spawn('npx', ['webpack', 'serve', '--config', 'FrontEnd/Forest_Drive/webpack.config.js', '--mode', 'development'], {
            cwd: webpackPath,
            shell: true,
            stdio: 'inherit'
        });
        
        webpackProcess.on('error', (error) => {
            console.error('Error starting webpack server:', error);
            reject(error);
        });
        
        // Give the server time to start
        setTimeout(() => {
            resolve();
        }, 3000);
    });
}

// Check if server is running
async function checkServerStatus(url) {
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        return false;
    }
}

module.exports = { startWebpackServer, checkServerStatus };
