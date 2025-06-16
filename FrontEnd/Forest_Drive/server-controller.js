const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001; // Control server port
const WEBPACK_PORT = 8080; // Webpack dev server port

app.use(cors());
app.use(express.json());

let webpackProcess = null;
let serverStatus = 'stopped';

// Check if webpack server is running
async function checkWebpackServer() {
    try {
        const response = await fetch(`http://localhost:${WEBPACK_PORT}`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Start webpack development server
function startWebpackServer() {
    return new Promise((resolve, reject) => {
        if (webpackProcess) {
            resolve({ success: true, message: 'Server already running' });
            return;
        }

        const projectRoot = path.resolve(__dirname, '../../../');
        
        console.log('🌲 Starting Forest Drive webpack server...');
        serverStatus = 'starting';

        webpackProcess = spawn('npx', [
            'webpack', 'serve',
            '--config', 'FrontEnd/Forest_Drive/webpack.config.js',
            '--mode', 'development',
            '--port', WEBPACK_PORT.toString()
        ], {
            cwd: projectRoot,
            shell: true,
            stdio: 'pipe'
        });

        let serverReady = false;

        webpackProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(output);
            
            if (output.includes('webpack compiled') || output.includes('Local:')) {
                if (!serverReady) {
                    serverReady = true;
                    serverStatus = 'running';
                    console.log('✅ Webpack server is ready!');
                    resolve({ success: true, message: 'Server started successfully' });
                }
            }
        });

        webpackProcess.stderr.on('data', (data) => {
            console.error('Webpack error:', data.toString());
        });

        webpackProcess.on('error', (error) => {
            console.error('Failed to start webpack server:', error);
            serverStatus = 'error';
            webpackProcess = null;
            reject({ success: false, message: error.message });
        });

        webpackProcess.on('close', (code) => {
            console.log(`Webpack server stopped with code ${code}`);
            serverStatus = 'stopped';
            webpackProcess = null;
        });

        // Timeout after 30 seconds
        setTimeout(() => {
            if (!serverReady) {
                serverStatus = 'timeout';
                reject({ success: false, message: 'Server start timeout' });
            }
        }, 30000);
    });
}

// API Routes
app.get('/api/server/status', async (req, res) => {
    const isRunning = await checkWebpackServer();
    res.json({
        status: isRunning ? 'running' : serverStatus,
        port: WEBPACK_PORT,
        url: `http://localhost:${WEBPACK_PORT}`
    });
});

app.post('/api/server/start', async (req, res) => {
    try {
        // Check if already running
        const isRunning = await checkWebpackServer();
        if (isRunning) {
            return res.json({
                success: true,
                message: 'Server is already running',
                url: `http://localhost:${WEBPACK_PORT}`
            });
        }

        const result = await startWebpackServer();
        res.json({
            ...result,
            url: `http://localhost:${WEBPACK_PORT}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to start server'
        });
    }
});

app.post('/api/server/stop', (req, res) => {
    if (webpackProcess) {
        webpackProcess.kill();
        webpackProcess = null;
        serverStatus = 'stopped';
        res.json({ success: true, message: 'Server stopped' });
    } else {
        res.json({ success: true, message: 'Server was not running' });
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down control server...');
    if (webpackProcess) {
        webpackProcess.kill();
    }
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🎮 Forest Drive Control Server running on http://localhost:${PORT}`);
    console.log(`🌲 Ready to manage webpack server on port ${WEBPACK_PORT}`);
});

module.exports = app;
