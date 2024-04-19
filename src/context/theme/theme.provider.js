import React, { createContext, useState } from 'react';

export const ThemeContext = createContext({})

const lightTheme = {
    '--main-background-color': '#F0F0F0',
    '--main-highlight-color': '#202020',
    '--header-highlight': '#202020',


    '--opacity': 'rgba(255,255,255,0.7)'
}

const darkTheme = {
    '--main-background-color': '#202020',
    '--main-highlight-color': '#F0F0F0',
    '--header-highlight': '#F0F0F0',

    '--opacity': 'rgba(0,0,0,0.7)'
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