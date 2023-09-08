import React, { createContext, useState } from 'react';

export const ThemeContext = createContext({})

const lightTheme = {
    '--background-color': '#E8F5E9',
    '--secondary-text-color' : '#263238',
    '--error-text-color' : '#D32F2F',
}

const darkTheme = {
    '--background-color': '#37474F',
    '--secondary-text-color': '#CFD8DC',
    '--error-text-color' : '#E57373',
}

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(darkTheme);
    const [themeName, setThemeName] = useState('dark');

    const toggleTheme = () => {
        setCurrentTheme(prevTheme => {
            if(prevTheme === darkTheme) {
                setThemeName('light');
                return lightTheme
            } else {
                setThemeName('dark');
                return darkTheme;
            }
        });
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme, themeName }}>
            {children}
        </ThemeContext.Provider>
    );

};

export default ThemeContext;