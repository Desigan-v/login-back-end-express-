import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db';
import userRoutes from './routes/user_routes';
import { json } from 'body-parser';

// Load environment variables from .env file
dotenv.config();

const app: Express = express();  // Use Express type for app
const PORT: string | number = process.env.PORT || 3000;  // Add types for PORT

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3001', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  credentials: true, 
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));  // Apply CORS middleware with options

// Middleware to parse JSON request bodies
app.use(json());  // You can use express.json() directly if using Express v4.16+

// User routes
app.use('/api', userRoutes);  // Register the user routes under the '/api' path

// Start the server and sync with the database
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    await sequelize.sync();  // Sync Sequelize models with the database
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
});
