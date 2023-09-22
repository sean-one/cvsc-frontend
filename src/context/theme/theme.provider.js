import React, { createContext, useState } from 'react';

export const ThemeContext = createContext({})

const lightTheme = {
    '--main-text-color': '#37474F',
    '--main-color': '#70AF97',
    '--secondary-color': '#263238',
    '--secondary-text-color' : '#263238',
}

const darkTheme = {
    '--main-text-color': '#5F9E7F',
    '--main-color': '#263238',
    '--secondary-color': '#70AF97',
    '--secondary-text-color': '#CFD8DC',
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