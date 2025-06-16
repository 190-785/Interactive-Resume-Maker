const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log('🌲 Starting Forest Drive 3D Resume Server...');

// Change to project root directory
const projectRoot = path.resolve(__dirname, '../../');
process.chdir(projectRoot);

console.log(`📁 Working directory: ${process.cwd()}`);

// Function to check if server is already running
function checkServerRunning(port = 8080) {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: port,
            path: '/',
            method: 'HEAD',
            timeout: 1000
        }, (res) => {
            resolve(true);
        });
        
        req.on('error', () => {
            resolve(false);
        });
        
        req.on('timeout', () => {
            resolve(false);
        });
        
        req.end();
    });
}

// Start webpack dev server
async function startWebpackServer() {
    try {
        // Check if server is already running
        const isRunning = await checkServerRunning();
        if (isRunning) {
            console.log('✅ Server is already running at http://localhost:8080');
            return;
        }
        
        console.log('🚀 Starting webpack development server...');
        
        const webpackProcess = spawn('npx', [
            'webpack', 'serve',
            '--config', 'FrontEnd/Forest_Drive/webpack.config.js',
            '--mode', 'development',
            '--open'
        ], {
            stdio: 'inherit',
            shell: true
        });
        
        webpackProcess.on('error', (error) => {
            console.error('❌ Error starting webpack server:', error.message);
            process.exit(1);
        });
        
        webpackProcess.on('close', (code) => {
            console.log(`🔻 Webpack server stopped with code ${code}`);
        });
        
        // Keep the process alive
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down server...');
            webpackProcess.kill();
            process.exit(0);
        });
        
        console.log('✅ Server startup initiated! Visit http://localhost:8080 once ready.');
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.log('\n📋 Manual setup instructions:');
        console.log('1. Open terminal in project root');
        console.log('2. Run: npx webpack serve --config FrontEnd/Forest_Drive/webpack.config.js --mode development');
        process.exit(1);
    }
}

// Start the server
startWebpackServer();
