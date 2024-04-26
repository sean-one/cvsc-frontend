import React, { createContext, useState } from 'react';

export const ThemeContext = createContext({})

const lightTheme = {
    '--main-background-color': '#F0F0F0',
    '--main-highlight-color': '#202020',
    '--text-color': '#00331a',
    '--header-highlight': '#202020',
    '--opacity': 'rgba(240,240,240,0.7)'
}

const darkTheme = {
    '--main-background-color': '#202020',
    '--main-highlight-color': '#F0F0F0',
    '--text-color': '#00cc66',
    '--header-highlight': '#F0F0F0',
    '--opacity': 'rgba(32,32,32,0.7)'
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