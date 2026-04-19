import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/channel/dashboard')
            .then(res => {
                setUser(res.data.user_info);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const userRes = await api.get('/channel/dashboard');
        setUser(userRes.data.user_info);
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await api.post('/auth/register', { username, email, password });
        const userRes = await api.get('/channel/dashboard');
        setUser(userRes.data.user_info);
        return res.data;
    };

    const logout = async () => {
        try { await api.post('/auth/logout'); } catch {}
        setUser(null);
    };

    const googleLogin = async (credential) => {
        const res = await api.post('/auth/google', { credential });
        const userRes = await api.get('/channel/dashboard');
        setUser(userRes.data.user_info);
        return res.data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
