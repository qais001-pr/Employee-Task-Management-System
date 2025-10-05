require('dotenv').config();
process.env.DOTENVX_SILENT = 'true'; // Silence dotenvx tips (optional)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./connectionDb'); // your MSSQL connection setup

// Import all route modules
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const projectRoutes = require('./routes/projectRoutes');
const roleRoutes = require('./routes/roleRoutes');
const taskRoutes = require('./routes/taskRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const timeSheetRoutes = require('./routes/timesheetRoutes');
const commetsRoutes = require('./routes/commentRoutes');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to DB
connectDB();

// Public routes
app.use('/api/auth', authRoutes);

// Protected / Main routes
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/timesheets', timeSheetRoutes);
app.use('/api/comments', commetsRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('✅ Employee & Task Management System API is running...');
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error('🔥 Error:', err.message);
    res.status(500).json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
