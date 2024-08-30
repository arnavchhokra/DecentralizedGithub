require("dotenv").config();
const express = require('express');
const cors = require('cors');
const pinataRoutes = require("./routes/pinataRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());



// Use the pinataRoutes for handling API requests to /api
app.use("/api", pinataRoutes);



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
