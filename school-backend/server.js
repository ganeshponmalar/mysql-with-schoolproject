const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'School API is running' });
});

// Mount Routers
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admissions', require('./routes/admission.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/teachers', require('./routes/teacher.routes'));
app.use('/api/admin', require('./routes/dashboard.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/fees', require('./routes/fee.routes'));
app.use('/api/parents', require('./routes/parent.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/results', require('./routes/exam_result.routes'));
app.use('/api/homework', require('./routes/homework.routes'));
app.use('/api/announcements', require('./routes/announcement.routes'));


// Global Error Middleware
// Global Error Middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
