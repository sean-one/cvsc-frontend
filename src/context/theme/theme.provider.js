import React, { useEffect, createContext, useState } from 'react';

export const ThemeContext = createContext({})

const lightTheme = {
    '--main-background-color': '#F0F0F0',
    '--main-highlight-color': '#202020',
    '--text-color': '#00331a',
    '--error-color': '#D32F2F',
    '--header-highlight': '#202020',
    '--opacity': 'rgba(240,240,240,0.7)'
}

const darkTheme = {
    '--main-background-color': '#202020',
    '--main-highlight-color': '#F0F0F0',
    '--text-color': '#00cc66',
    '--error-color': '#992121',
    '--header-highlight': '#F0F0F0',
    '--opacity': 'rgba(32,32,32,0.7)'
}

export const ThemeProvider = ({ children }) => {
    
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('cvsc-theme');
        return savedTheme === 'light' ? lightTheme : darkTheme;
    }

    const [currentTheme, setCurrentTheme] = useState(getInitialTheme());
    const [themeName, setThemeName] = useState(localStorage.getItem('cvsc-theme') || 'dark');

    useEffect(() => {
        localStorage.setItem('cvsc-theme', themeName);
    }, [themeName])

    const toggleTheme = () => {
        setCurrentTheme(prevTheme => {
            const newTheme = prevTheme === darkTheme ? 'light' : 'dark';
            setThemeName(newTheme)
            return newTheme === 'light' ? lightTheme : darkTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme, themeName }}>
            {children}
        </ThemeContext.Provider>
    );

};

export default ThemeContext;