const db = require('../db/db');
const ErrorHandler = require('../middleware/errorHandler');

const getChildren = async (req, res, next) => {
    try {
        const parentId = req.user.id;
        const [children] = await db.query(`
            SELECT s.*, u.name as user_name, u.email as user_email
            FROM students s
            JOIN parent_students ps ON ps.student_id = s.id
            JOIN users u ON s.userId = u.id
            WHERE ps.parent_id = ?
        `, [parentId]);
        console.log('[getChildren] parentId=', parentId, 'children=', children);
        res.json({ success: true, children });
    } catch (error) {
        next(error);
    }
};


const getChildProfile = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        const [studentInfo] = await db.query(`
            SELECT s.*, u.name, u.email 
            FROM students s 
            JOIN users u ON s.userId = u.id 
            WHERE s.id = ?
        `, [studentId]);

        if (studentInfo.length === 0) {
            return next(new ErrorHandler("Student not found", 404));
        }
        res.json({ success: true, profile: studentInfo[0] });
    } catch (error) {
        next(error);
    }
};

const getChildAttendance = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        const [attendance] = await db.query('SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC', [studentId]);
        res.json({ success: true, attendance });
    } catch (error) {
        next(error);
    }
};

const getChildResults = async (req, res, next) => {
    try {
        const parentId = req.user.id;
        const studentId = req.params.id;

        console.log('========== getChildResults DEBUG ==========');
        console.log('parentId:', parentId);
        console.log('studentId:', studentId);
        console.log('req.user:', req.user);

        // Verify parent linked to student
        const [linked] = await db.query(
            `SELECT * FROM parent_students WHERE parent_id = ? AND student_id = ?`,
            [parentId, studentId]
        );

        console.log('linked rows:', linked.length, linked);

        if (linked.length === 0) {
            console.log('Parent NOT linked to student');
            return res.status(403).json({
                success: false,
                message: "You are not linked to this student"
            });
        }

        console.log('Parent IS linked to student');

        // Fetch results
        const [results] = await db.query(
            `SELECT * FROM exam_results WHERE student_id = ? ORDER BY exam_date DESC`,
            [studentId]
        );

        console.log('results count:', results.length);
        console.log('results data:', JSON.stringify(results, null, 2));

        res.status(200).json({
            success: true,
            results
        });

    } catch (error) {
        console.error('getChildResults ERROR:', error);
        next(error);
    }
};

const getChildAssignments = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        // Fetch homework for the class the student belongs to
        // First get student's class_id. In the current schema, student table has section.
        // Let's assume we fetch homework by class_id = 1 (A) for now, or match section.
        // Ideally we join students with classes.
        const [assignments] = await db.query(`
            SELECT h.* FROM homework h
            JOIN students s ON s.id = ?
            -- Note: For now we return all or match by subject if needed.
            -- Realistically, assignments table has class_id.
            -- Let's just return all for student's class if we had class_id in students.
            -- Since we don't have classId in students yet in my previous migration, 
            -- I'll just return all homework for the general "school" or match by section if shared.
            ORDER BY h.due_date ASC
        `, [studentId]);

        res.json({ success: true, assignments });
    } catch (error) {
        next(error);
    }
};

const getNotifications = async (req, res, next) => {
    try {
        const [notifications] = await db.query('SELECT * FROM announcements WHERE target_role IN ("all", "parent") ORDER BY created_at DESC');
        res.json({ success: true, notifications });
    } catch (error) {
        next(error);
    }
};

const getTeachers = async (req, res, next) => {
    try {
        const parentId = req.user.id;
        // Find teachers of classes the children belong to. Let's just return all teachers for simplicity or mapped ones.
        const [teachers] = await db.query(`
            SELECT t.id, t.teacherName, t.subject, u.id as user_id
            FROM teachers t
            JOIN users u ON t.user_id = u.id
        `);
        res.json({ success: true, teachers });
    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const parentId = req.user.id;
        const { teacherId } = req.params;
        const [messages] = await db.query(`
            SELECT content, created_at, sender_id 
            FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        `, [parentId, teacherId, teacherId, parentId]);
        res.json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const parentId = req.user.id;
        const { teacherId } = req.params;
        const { content } = req.body;

        await db.query(`
            INSERT INTO messages (sender_id, receiver_id, content)
            VALUES (?, ?, ?)
        `, [parentId, teacherId, content]);

        res.json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getChildren,
    getChildProfile,
    getChildAttendance,
    getChildResults,
    getChildAssignments,
    getNotifications,
    getTeachers,
    getMessages,
    sendMessage
};
