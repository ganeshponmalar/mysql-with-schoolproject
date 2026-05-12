const db = require('../db/db');
const { errorHandler } = require('../middleware/errorHandler');
const ErrorHandler = require('../middleware/errorMiddleware');

// CREATE TEACHER
const createTeacherController = errorHandler(async (req, res, next) => {
    const {
        teacherId,
        teacherName,
        subject,
        department,
        qualification,
        user_id
    } = req.body;

    if (!teacherId || !teacherName || !subject || !department || !qualification) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const query = `
        INSERT INTO teachers
        (teacherId, teacherName, subject, department, qualification, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
        teacherId,
        teacherName,
        subject,
        department,
        qualification,
        user_id || null
    ]);

    res.status(201).json({
        success: true,
        message: "Teacher Created Successfully",
        teacherId: result.insertId,
    });
});


// GET ALL TEACHERS
const getAllTeacherController = errorHandler(async (req, res, next) => {
    const query = `
        SELECT 
            id,
            teacherId,
            teacherName,
            subject,
            department,
            qualification
        FROM teachers
    `;

    const [teachers] = await db.execute(query);

    if (teachers.length === 0) {
        return next(new ErrorHandler("Teacher Not Found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Teacher Retrieved Successfully",
        teachers,
    });
});

// GET SINGLE TEACHER
const getSingleTeacher = errorHandler(async (req, res, next) => {
    const { id } = req.params;

    const query = `
        SELECT 
            id,
            teacherId,
            teacherName,
            subject,
            department,
            qualification
        FROM teachers
        WHERE id = ?
    `;

    const [teacher] = await db.execute(query, [id]);

    if (teacher.length === 0) {
        return next(new ErrorHandler("Teacher Not Found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Teacher Found Successfully",
        teacher: teacher[0],
    });
});

// UPDATE TEACHER
const updateTeacherController = errorHandler(async (req, res, next) => {
    const { id } = req.params;

    const {
        teacherId,
        teacherName,
        subject,
        department,
        qualification,
        user_id
    } = req.body;

    const query = `
        UPDATE teachers
        SET 
            teacherId = ?,
            teacherName = ?,
            subject = ?,
            department = ?,
            qualification = ?,
            user_id = ?
        WHERE id = ?
    `;

    const [result] = await db.execute(query, [
        teacherId,
        teacherName,
        subject,
        department,
        qualification,
        user_id || null,
        id
    ]);

    if (result.affectedRows === 0) {
        return next(new ErrorHandler("Teacher Not Found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Teacher Updated Successfully",
    });
});


// DELETE TEACHER
const deleteTeacherController = errorHandler(async (req, res, next) => {
    const { id } = req.params;

    const query = `DELETE FROM teachers WHERE id = ?`;

    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
        return next(new ErrorHandler("Teacher Not Found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Teacher Deleted Successfully",
    });
});

// TEACHER PROFILE
const teacherProfile = errorHandler(async (req, res, next) => {
    const { id } = req.user;

    const query = `
        SELECT 
            id,
            teacherId,
            teacherName,
            subject,
            department,
            qualification
        FROM teachers
        WHERE user_id = ?
    `;

    const [teacher] = await db.execute(query, [id]);


    if (teacher.length === 0) {
        return next(new ErrorHandler("Teacher record not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Teacher Profile Found Successfully",
        teacher: teacher[0],
    });
});

module.exports = {
    createTeacherController,
    getAllTeacherController,
    getSingleTeacher,
    updateTeacherController,
    deleteTeacherController,
    teacherProfile
};
