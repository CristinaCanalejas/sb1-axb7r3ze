import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Database } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Initialize database
console.log('Initializing database...');
const db = new Database();
await db.init();
console.log('Database initialized successfully');

// Import routes
import departmentsRouter from './routes/departments.js';
import equipmentRouter from './routes/equipment.js';
import personnelRouter from './routes/personnel.js';

// Use routes
app.use('/api/departments', departmentsRouter(db));
app.use('/api/equipment', equipmentRouter(db));
app.use('/api/personnel', personnelRouter(db));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Available routes:');
  console.log('  - /api/departments');
  console.log('  - /api/equipment');
  console.log('  - /api/personnel');
});