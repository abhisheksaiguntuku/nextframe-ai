import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
    const { register, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 mb-2 text-center relative z-10">
                    NextFrame AI
                </h1>
                <p className="text-gray-400 text-center mb-8 text-sm">Create your creator portal</p>
                
                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center space-x-2">
                    <span>⚠️</span> <span>{error}</span>
                </div>}
                
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">Username</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-950 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder-gray-600"
                            placeholder="CreatorName"
                            value={username} onChange={e => setUsername(e.target.value)} required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full bg-gray-950 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder-gray-600"
                            placeholder="creator@youtube.com"
                            value={email} onChange={e => setEmail(e.target.value)} required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-gray-950 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder-gray-600"
                            placeholder="••••••••"
                            value={password} onChange={e => setPassword(e.target.value)} required 
                        />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-xl hover:from-orange-400 hover:to-red-500 hover:shadow-lg hover:shadow-red-500/25 transition-all transform active:scale-[0.98]">
                        Register
                    </button>
                </form>
                
                <div className="relative z-10 my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-900 text-gray-500">Or continue with</span>
                    </div>
                </div>
                
                <div className="flex justify-center relative z-10 mb-6">
                    <GoogleLogin 
                        theme="outline"
                        onSuccess={async (credentialResponse) => {
                            try {
                                await googleLogin(credentialResponse.credential);
                                navigate('/dashboard');
                            } catch (err) {
                                setError("Google log in failed.");
                            }
                        }}
                        onError={() => setError('Google Log in failed')}
                    />
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm relative z-10">
                    Already have an account? <Link to="/login" className="text-red-400 font-medium hover:text-red-300">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
