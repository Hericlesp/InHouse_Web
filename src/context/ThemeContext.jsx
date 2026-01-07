import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first, default to light
        const saved = localStorage.getItem('inhouse-theme');
        return saved || 'light';
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('inhouse-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const value = {
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
