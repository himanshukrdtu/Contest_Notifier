const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db.js');
const contestRoutes = require('./routes/contest.routes.js');
const scrapeRoutes = require('./routes/scrape.routes.js');
const addUser=require('./routes/user.routes.js');
const sendContestNotifications=require('./routes/notification.routes.js');
      
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (adjust in production if needed)
app.use(cors());

// Parse JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB and start server
async function startServer() {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // Base route
    app.get('/', (req, res) => {
      res.send('✅ Server is running and MongoDB is connected');
    });

    // API routes
    app.use('/api', contestRoutes);
    app.use('/api', scrapeRoutes);
    app.use('/api', addUser);
    app.use('/api', sendContestNotifications);

   

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

startServer();
