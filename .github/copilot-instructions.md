<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Full-Stack Application - Copilot Instructions

This is a full-stack web application built with:

## Frontend
- **Vanilla HTML5** - Clean, semantic markup
- **Pure CSS3** - Modern styling with Flexbox/Grid, responsive design
- **Vanilla JavaScript (ES6+)** - DOM manipulation, fetch API for backend communication

## Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework for REST API
- **JSON** - Data format for API responses

## Project Structure
- `server.js` - Main Express server file with middleware setup
- `controllers/` - Business logic and request handlers
  - `dataController.js` - Data management operations
  - `healthController.js` - Server status operations
- `routes/` - Route definitions and API endpoints
  - `api.js` - API route handlers
  - `index.js` - Main page routes
- `models/` - Data models and business logic
  - `dataModel.js` - Data storage and manipulation
- `middleware/` - Custom middleware functions
  - `errorHandler.js` - Error handling and logging
- `public/` - Static frontend files
  - `index.html` - Main HTML page
  - `styles.css` - CSS styles
  - `script.js` - Client-side JavaScript
- `package.json` - Node.js dependencies and scripts

## Development Guidelines
- Use modern ES6+ JavaScript features
- Follow RESTful API conventions
- Follow MVC (Model-View-Controller) architecture pattern
- Implement proper error handling and logging
- Use semantic HTML elements
- Write responsive CSS without frameworks
- Keep frontend and backend concerns separated
- Use async/await for asynchronous operations
- Separate business logic into controllers
- Use middleware for cross-cutting concerns
- Keep models focused on data operations

## API Endpoints
- `GET /api/health` - Server status check
- `GET /api/data` - Fetch sample data
- `POST /api/data` - Create new data items
- `GET /api/data/:id` - Get single data item
- `DELETE /api/data/:id` - Delete data item

When suggesting code improvements or new features, maintain the vanilla approach without introducing additional frameworks or libraries.
