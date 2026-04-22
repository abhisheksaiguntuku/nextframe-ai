import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [hasChannel, setHasChannel] = useState(false);
    const [channelData, setChannelData] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshChannel = async () => {
        try {
            const res = await api.get('/channel/dashboard');
            setUser(res.data.user_info);
            setHasChannel(res.data.has_channel);
            setChannelData(res.data.channel_data);
        } catch (err) {
            setUser(null);
            setHasChannel(false);
            setChannelData(null);
        }
    };

    useEffect(() => {
        refreshChannel().finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        await refreshChannel();
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await api.post('/auth/register', { username, email, password });
        await refreshChannel();
        return res.data;
    };

    const logout = async () => {
        try { await api.post('/auth/logout'); } catch {}
        setUser(null);
        setHasChannel(false);
        setChannelData(null);
    };

    const googleLogin = async (credential) => {
        const res = await api.post('/auth/google', { credential });
        await refreshChannel();
        return res.data;
    };

    return (
        <AuthContext.Provider value={{ user, hasChannel, channelData, loading, login, register, logout, googleLogin, refreshChannel }}>
            {children}
        </AuthContext.Provider>
    );
};
