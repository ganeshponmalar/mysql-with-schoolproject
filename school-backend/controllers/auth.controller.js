const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'student']
        );

        res.status(201).json({ message: 'Registration successful', userId: result.insertId });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (role && user.role !== role) {
            return res.status(403).json({ message: `Account belongs to a ${user.role}, not ${role}.` });
        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'supersecret',
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET || 'refreshsecret',
            { expiresIn: '7d' }
        );

        await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.json({
            message: 'Logged in successfully',
            token: accessToken,
            user: { id: user.id, name: user.name, role: user.role }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

const refresh = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;
        if (!incomingRefreshToken) return res.status(401).json({ message: 'No refresh token' });

        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET || 'refreshsecret');
        } catch (e) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE id = ? AND refresh_token = ?', [decoded.id, incomingRefreshToken]);
        if (users.length === 0) return res.status(403).json({ message: 'Refresh token not found or reused' });

        const user = users[0];

        const newAccessToken = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'supersecret',
            { expiresIn: '15m' }
        );

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.json({ token: newAccessToken });
    } catch (err) {
        console.error("Refresh Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await db.query('UPDATE users SET refresh_token = NULL WHERE refresh_token = ?', [refreshToken]);
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, refresh, logout };
