const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

// Simple HTTP server that starts webpack when accessed
const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.url === '/start-webpack') {
        try {
            // Check if webpack is already running
            const isRunning = await checkWebpackRunning();
            
            if (isRunning) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Webpack server is already running',
                    redirect: 'http://localhost:8080'
                }));
                return;
            }
            
            // Start webpack server
            const projectRoot = path.resolve(__dirname, '../../');
            
            const webpackProcess = spawn('npx', [
                'webpack', 'serve',
                '--config', 'FrontEnd/Forest_Drive/webpack.config.js',
                '--mode', 'development',
                '--port', '8080'
            ], {
                cwd: projectRoot,
                shell: true,
                detached: true,
                stdio: 'ignore'
            });
            
            // Detach the process so it runs independently
            webpackProcess.unref();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                message: 'Webpack server started',
                redirect: 'http://localhost:8080'
            }));
            
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                message: error.message 
            }));
        }
    } else if (req.url === '/check-webpack') {
        const isRunning = await checkWebpackRunning();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            running: isRunning,
            url: 'http://localhost:8080'
        }));
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Function to check if webpack server is running
function checkWebpackRunning() {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 8080,
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

// Start the service on port 9999
server.listen(9999, () => {
    console.log('🚀 Forest Drive Auto-Starter service running on http://localhost:9999');
    console.log('🌲 Ready to start webpack server on demand');
});

// Keep the service running
process.on('SIGINT', () => {
    console.log('🛑 Shutting down auto-starter service...');
    server.close();
    process.exit(0);
});

module.exports = server;
