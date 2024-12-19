const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the route for user registration
const registerUserRoute = require('./register_user');
// Import the route for user login
const loginUserRoute = require('./login');
// Import the route for getting user data
const getUserDataRoute = require('./get_user_data');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Ensures that we can parse JSON requests

// Use the routes
app.use('/register_user', registerUserRoute);
app.use('/login', loginUserRoute);
app.use('/get_user_data', getUserDataRoute); // Add this line for the new route

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
