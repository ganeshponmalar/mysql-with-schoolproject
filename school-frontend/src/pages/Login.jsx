import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Settings, Users } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const roleInfo = {
        student: { icon: <GraduationCap size={40} className="mx-auto" />, desc: "Access your attendance, homework submissions, fees, and exam results directly.", bg: "bg-primary" },
        teacher: { icon: <BookOpen size={40} className="mx-auto" />, desc: "Manage assigned classes, mark attendance, and grade student assignments intuitively.", bg: "bg-secondary" },
        admin: { icon: <Settings size={40} className="mx-auto" />, desc: "Complete administrative control over operations, admissions, and entire school analytics.", bg: "bg-accent" },
        parent: { icon: <Users size={40} className="mx-auto" />, desc: "Monitor your child's profile, attendance, exam results, and stay in touch with teachers.", bg: "bg-teal-500" }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password, role);
            if (user.role !== role) {
                setError(`Error: Account belongs to a ${user.role}. Please select the correct portal type.`);
                return;
            }
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'teacher') navigate('/teacher');
            else if (user.role === 'parent') navigate('/parent');
            else navigate('/student');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed Check credentials');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] overflow-hidden flex flex-col md:flex-row">

                {/* Left Side: Dynamic Role Decorator */}
                <div className={`p-10 text-center flex flex-col justify-center transition-colors duration-500 md:w-5/12 text-white ${roleInfo[role].bg}`}>
                    <div className="bg-white/20 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm transition-transform hover:scale-110">
                        {React.cloneElement(roleInfo[role].icon, { className: "text-white" })}
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-4 capitalize">{role} Portal</h2>
                    <p className="text-white/90 text-lg leading-relaxed">
                        {roleInfo[role].desc}
                    </p>
                </div>

                {/* Right Side: Login Form */}
                <div className="p-10 md:w-7/12 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In Securely</h2>
                    {error && <div className="mb-5 bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg text-sm tracking-wide">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Selector Tabs */}
                        <div className="flex p-1 bg-gray-100 rounded-xl mb-6 flex-wrap">
                            {['student', 'teacher', 'admin', 'parent'].map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => { setRole(r); setError(''); }}
                                    className={`flex-1 py-2 text-sm font-semibold capitalize rounded-lg transition-all ${role === r ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                className="w-full border shadow-sm border-gray-200 bg-gray-50/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                placeholder="name@school.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                className="w-full border shadow-sm border-gray-200 bg-gray-50/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full text-white font-bold py-3.5 px-4 rounded-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg mt-4
                            ${role === 'student' ? 'bg-primary hover:bg-primary/90 shadow-primary/30' : role === 'teacher' ? 'bg-secondary hover:bg-secondary/90 shadow-secondary/30' : role === 'parent' ? 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/30' : 'bg-accent hover:bg-accent/90 shadow-accent/30'}`}>
                            Login to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
