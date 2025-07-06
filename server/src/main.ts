import express from 'express';
import { createServer } from 'http';
import cors from 'cors';

// Route imports
import api from './routes/api/api.js';

const PORT = 8080;

const app = express();
const server = createServer(app);

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.static("build")); // Adjust path if needed for your static files
app.use(express.json());

// Routes
app.use('/api', api);

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});