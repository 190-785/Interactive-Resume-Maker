# Interactive Resume Maker

## Description

Interactive Resume Maker is a dynamic 3D resume application featuring a forest-themed drive experience. This project combines a Java Spring Boot backend with a JavaScript-based 3D frontend using Three.js, allowing users to create and view resumes in an immersive 3D environment.

## Project Structure

The project is organized into two main components:

### Backend (`BackEnd/`)
- Java Spring Boot application
- MongoDB integration for data storage
- RESTful API endpoints for resume data

### Frontend (`FrontEnd/`)
- **Forest Drive** (`FrontEnd/Forest_Drive/`): 3D interactive resume experience
- **Login System** (`FrontEnd/Login/`): User authentication and profile management

## Environment Requirements

- Java JDK 11 or newer
- Node.js 14.x or newer
- MongoDB 4.4 or newer
- Maven 3.6 or newer

## Setup and Installation

### Database Setup

1. Install MongoDB if not already installed
2. Start MongoDB service:
   ```powershell
   # Using Windows Service
   Start-Service MongoDB

   # OR manually start MongoDB
   mongod --dbpath="C:\data\db"
   ```
3. The application is configured to connect to MongoDB at `localhost:27017` by default

### Backend

1. Navigate to the `BackEnd` directory:
   ```powershell
   cd BackEnd
   ```

2. Build the application using Maven:
   ```powershell
   mvn clean install
   ```

3. Run the Spring Boot application:
   ```powershell
   mvn spring-boot:run
   ```
   
   OR

   ```powershell
   java -jar target/resume-forest-1.0.0.jar
   ```

4. The backend API will be available at `http://localhost:8080`

### Frontend - Forest Drive (3D Experience)

1. Navigate to the Forest Drive directory:
   ```powershell
   cd FrontEnd/Forest_Drive
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   # Using the provided batch file (recommended)
   .\start-server.bat

   # OR using webpack directly
   npx webpack serve --config webpack.config.js
   ```

   The `start-server.bat` file handles all webpack configuration and starts the development server automatically, making it the simplest way to run the application.

4. Access the 3D Forest Drive experience at `http://localhost:3000` (or the port specified in your configuration)

### Frontend - Login System

1. The login system can be accessed directly by opening the HTML files in a browser:
   - `FrontEnd/Login/Login_Page.html`
   - `FrontEnd/Login/Register_Page.html`
   - `FrontEnd/Login/dashboard.html`
   - `FrontEnd/Login/Profile.html`

2. For local development with backend connectivity:
   - Use a local server like Live Server in VS Code
   - Or set up a simple HTTP server:
     ```powershell
     cd FrontEnd/Login
     npx http-server
     ```

## Running Components Individually

### Running Backend Only

1. Navigate to the `BackEnd` directory
2. Start the Spring Boot application:
   ```powershell
   mvn spring-boot:run
   ```
3. Test the API endpoints using Postman or curl:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:8080/api/resume" -Method Get
   ```

### Running Forest Drive Frontend Only

1. Navigate to `FrontEnd/Forest_Drive`
2. To run with mock data (without backend):
   - Open `src/js/apiService.js` and set `useMockData` to `true` 
   - This configuration allows the 3D experience to run with sample data without requiring the backend

3. Start the server using the provided batch file (recommended method):
   ```powershell
   .\start-server.bat
   ```
   
   This batch file handles all webpack configuration and starts the development server automatically.

4. Alternatively, you can manually run the webpack dev server:
   ```powershell
   npx webpack serve --config webpack.config.js
   ```

### Running Login System Only

The login system can be run independently by:
1. Opening the HTML files directly in a browser
2. Modify `FrontEnd/Login/js/login.js` to use mock authentication if needed

## Connecting Frontend to Backend

### API Configuration

1. Frontend to Backend connection is configured in:
   - `FrontEnd/Forest_Drive/src/js/apiService.js`
   - `FrontEnd/Login/js/login.js` and other JS files

2. Default API URL is set to `http://localhost:8080`. To change this:
   - Update the `API_BASE_URL` in `FrontEnd/Forest_Drive/src/js/constants.js`
   - Update the API URL variables in the Login system JS files

### Backend to Database Connection

1. MongoDB connection settings are in `BackEnd/src/main/resources/application.properties`
2. Default configuration:
   ```properties
   spring.data.mongodb.host=localhost
   spring.data.mongodb.port=27017
   spring.data.mongodb.database=resumeforest
   ```

## Development Guide

### Modifying the 3D Experience

1. Main scene setup is in `FrontEnd/Forest_Drive/src/js/sceneSetup.js`
2. Resume content rendering is managed in `resumeContent.js`
3. Vehicle controls are defined in `vehicle.js`

### Customizing Resume Data

1. Resume data structure is defined in the backend models
2. To add new resume sections, update both:
   - Backend models in `BackEnd/src/main/java/com/resumeforest/model/`
   - Frontend rendering in `FrontEnd/Forest_Drive/src/js/resumeContent.js`

### Login System Integration

1. Authentication tokens from the login system are used for API authorization
2. Ensure CORS is properly configured in the backend to allow frontend connections

## Troubleshooting

### Common Issues

1. **Connection Refused to MongoDB**
   - Verify MongoDB is running: `Get-Service MongoDB`
   - Check MongoDB connection string in `application.properties`

2. **CORS Errors**
   - Ensure CORS is enabled in Spring Boot (`BackEnd/src/main/java/com/.../config/WebConfig.java`)

3. **3D Rendering Issues**
   - Check browser console for Three.js errors
   - Verify all 3D assets are properly loaded from `FrontEnd/Forest_Drive/src/assets/`

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

The GNU GPL is a free, copyleft license that ensures users have the freedom to run, study, share, and modify the software. Key aspects include:

- Freedom to use the software for any purpose
- Freedom to study how the program works and modify it
- Freedom to redistribute copies
- Freedom to distribute your modified versions to others

When using this software, you must:
- Include the original source code or provide access to it
- Include the license text with your distribution
- Release any modifications under the same license
- Preserve copyright notices

For more details, refer to the full [LICENSE](LICENSE) file.
