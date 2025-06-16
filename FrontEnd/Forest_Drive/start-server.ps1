# PowerShell script to start webpack development server
Write-Host "Starting 3D Forest Resume Server..." -ForegroundColor Green
Write-Host "Please wait while we prepare your interactive environment..." -ForegroundColor Yellow

# Change to the correct directory (project root)
Set-Location "F:\Interavtive_Resume\Interactive-Resume-Maker"

Write-Host "Starting webpack development server..." -ForegroundColor Cyan

try {
    # Start webpack devServer for development
    npx webpack serve --config FrontEnd/Forest_Drive/webpack.config.js --mode development --open
    
    Write-Host "3D Forest Resume Server is now running!" -ForegroundColor Green
    Write-Host "You can access it at: http://localhost:8080" -ForegroundColor White
}
catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
