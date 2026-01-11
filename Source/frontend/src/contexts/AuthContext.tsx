import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('access_token', res.data.access_token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
