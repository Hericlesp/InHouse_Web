import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved session on mount
        const savedUser = localStorage.getItem('inhouse-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const result = await authApi.login(email, password);
            if (result.success) {
                setUser(result.user);
                localStorage.setItem('inhouse-user', JSON.stringify(result.user));
                return { success: true, user: result.user };
            }
            return { success: false, error: 'Invalid credentials' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('inhouse-user');
    };

    const signup = async (name, email, password, user_type) => {
        try {
            const result = await authApi.signup(name, email, password, user_type);
            if (result.success) {
                setUser(result.user);
                localStorage.setItem('inhouse-user', JSON.stringify(result.user));
                return { success: true, user: result.user };
            }
            return { success: false, error: 'Signup failed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        signup
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
