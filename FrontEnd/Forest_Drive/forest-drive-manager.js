// Simple server manager that runs continuously
const { spawn } = require('child_process');
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const PORT = 3000;
const WEBPACK_PORT = 8080;

let webpackProcess = null;
let serverReady = false;

// Serve static files from the project
app.use(express.static(path.join(__dirname, '../../')));

// Check if webpack server is running
async function pingWebpackServer() {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: WEBPACK_PORT,
            path: '/',
            method: 'HEAD',
            timeout: 1000
        }, (res) => {
            resolve(true);
        });
        
        req.on('error', () => resolve(false));
        req.on('timeout', () => resolve(false));
        req.end();
    });
}

// Start webpack server
function startWebpackServer() {
    if (webpackProcess) return;
    
    console.log('🚀 Starting webpack development server...');
    
    const projectRoot = path.resolve(__dirname, '../../');
    
    webpackProcess = spawn('npx', [
        'webpack', 'serve',
        '--config', 'FrontEnd/Forest_Drive/webpack.config.js',
        '--mode', 'development',
        '--port', WEBPACK_PORT.toString(),
        '--host', 'localhost'
    ], {
        cwd: projectRoot,
        shell: true,
        stdio: 'pipe'
    });
    
    webpackProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('webpack compiled') || output.includes('Local:')) {
            if (!serverReady) {
                serverReady = true;
                console.log('✅ Webpack server is ready at http://localhost:' + WEBPACK_PORT);
            }
        }
    });
    
    webpackProcess.stderr.on('data', (data) => {
        console.error('Webpack error:', data.toString());
    });
    
    webpackProcess.on('close', (code) => {
        console.log(`Webpack server stopped with code ${code}`);
        webpackProcess = null;
        serverReady = false;
        
        // Restart automatically after 2 seconds
        setTimeout(startWebpackServer, 2000);
    });
}

// API endpoint to redirect to webpack server
app.get('/forest-drive', async (req, res) => {
    const isRunning = await pingWebpackServer();
    
    if (isRunning) {
        res.redirect(`http://localhost:${WEBPACK_PORT}`);
    } else {
        res.send(`
            <html>
            <head>
                <title>Starting Forest Drive...</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        min-height: 100vh; 
                        margin: 0; 
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        text-align: center;
                    }
                    .container {
                        background: rgba(255,255,255,0.1);
                        padding: 40px;
                        border-radius: 15px;
                        backdrop-filter: blur(10px);
                    }
                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid rgba(255,255,255,0.3);
                        border-top: 4px solid white;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
                <script>
                    // Auto-refresh every 2 seconds until server is ready
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                </script>
            </head>
            <body>
                <div class="container">
                    <div class="spinner"></div>
                    <h2>🌲 Starting Forest Drive 3D Scene</h2>
                    <p>Please wait while we prepare your interactive environment...</p>
                    <p><small>This page will automatically redirect when ready.</small></p>
                </div>
            </body>
            </html>
        `);
    }
});

// Start the manager server
app.listen(PORT, () => {
    console.log(`🎮 Forest Drive Manager running on http://localhost:${PORT}`);
    console.log(`🌲 Access Forest Drive at: http://localhost:${PORT}/forest-drive`);
    
    // Start webpack server immediately
    startWebpackServer();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Shutting down...');
    if (webpackProcess) {
        webpackProcess.kill();
    }
    process.exit(0);
});

module.exports = app;
