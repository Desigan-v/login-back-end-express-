"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const user_routes_1 = __importDefault(require("./routes/user_routes"));
const body_parser_1 = require("body-parser");
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)(); // Use Express type for app
const PORT = process.env.PORT || 3000; // Add types for PORT
// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions)); // Apply CORS middleware with options
// Middleware to parse JSON request bodies
app.use((0, body_parser_1.json)()); // You can use express.json() directly if using Express v4.16+
// User routes
app.use('/api', user_routes_1.default); // Register the user routes under the '/api' path
// Start the server and sync with the database
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on http://localhost:${PORT}`);
    try {
        yield db_1.default.sync(); // Sync Sequelize models with the database
        console.log('Database synced successfully');
    }
    catch (error) {
        console.error('Error syncing the database:', error);
    }
}));
