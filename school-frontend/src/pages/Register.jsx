import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] overflow-hidden">
                <div className="p-8 text-center bg-primary">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
                    <p className="mt-2 text-indigo-100 text-sm">Join the School Management System</p>
                </div>
                <div className="p-8">
                    {error && <div className="mb-5 bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg text-sm">{error}</div>}
                    {success && <div className="mb-5 bg-green-50 text-green-600 border border-green-100 p-3 rounded-lg text-sm">{success}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                className="w-full border bg-gray-50/50 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full border bg-gray-50/50 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="w-full border bg-gray-50/50 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">Register As</label>
                            <select
                                id="role"
                                className="w-full border bg-gray-50/50 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Administrator</option>
                                <option value="parent">Parent</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_10px_20px_theme('colors.primary.100')] mt-4 transition-transform hover:-translate-y-0.5">
                            Sign Up
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Register;
