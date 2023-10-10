import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import useTheme from '../hooks/useTheme';

const GlobalStyle = createGlobalStyle`
    :root {
        --header-height: 5rem;
        --main-color: ${(props) => props.theme['--main-color']};
        --secondary-color: ${(props) => props.theme['--secondary-color']};
        --main-text-color: ${(props) => props.theme['--main-text-color']};
        --secondary-text-color: ${(props) => props.theme['--secondary-text-color']};
        --trim-color: #286237;
        --opacity: ${(props) => props.theme['--opacity']};
        --black-and-white: ${(props) => props.theme['--black-and-white']};
        --site-icon-size: 1.8rem;
        --contact-icon-size: 2.2rem;
        --error-color: #D32F2F;
        // added to label to make it look like an input for image upload
        --form-input-background: #F4F6F5;
        --input-text-color: #263238;
        --input-placeholder: #286237;
        
    
        --max-page-width: 875px;
        --main-break-width: 500px;
    }
`;

const Styles = styled.div`
    .appContainer {
        min-width: 250px;
        min-height: 100vh;
        max-width: 100vw;
        color: var(--main-text-color);
        background-color: var(--main-color);
    }
    
    .innerContainer {
        padding: calc(var(--header-height) + 0.75rem) 0 0.5rem 0;
        box-sizing: border-box;
        
        @media (min-width: 500px) {
            padding: calc(var(--header-height) + 0.75rem) 0.5rem 0.5rem;
            max-width: var(--max-page-width);
            margin: 0 auto;
        }
    }

    .sectionContainer {
        margin: 0.5rem;
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid var(--trim-color);
    }

    .sectionHeader {
        display: flex;
        font-weight: bold;
        letter-spacing: 0.1rem;
        justify-content: space-between;
    }

    .sectionListHeader {
        border-bottom: 1px solid var(--secondary-color);
    }

    .removeBorder {
        border: none;
    }
    
    .truncated-text {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 4.8rem;
        line-height: 1.5;
        cursor: pointer;
    }

    button {
        padding: 0.5rem 1.25rem;
        border: none;
        border: 1px solid var(--secondary-color);
        color: var(--trim-color);
        border-radius: 5px;
        background-color: transparent;
        outline: none;

        :active {
            transform: translate(2px, 4px)
        }

        :disabled {
            color: var(--error-color);
            border: 1px solid var(--error-color);
            opacity: 0.6;
            cursor: not-allowed;
            background-color: transparent;
        }
    }

    input, textarea, select {
        width: 100%;
        font-size: 1.4rem;
        padding: 0.5rem 1rem;
        margin: 0; 
        border: none; 
        border-radius: 0;
        outline: none;
        appearance: none; /* For modern browsers */
        -webkit-appearance: none; /* For older versions of Safari */
        -moz-appearance: none; /* For Firefox */
        background: transparent;
        font-family: inherit; /* Inherit font from parent elements */
        background: var(--main-color);
        border-bottom: 1px solid var(--secondary-color);
        color: var(--secondary-color);

        ::placeholder {
            color: var(--input-placeholder);
        }
    }

    select, textarea {
        border: 1px solid var(--secondary-color);
        appearance: auto;
        -webkit-appearance: menulist;
        -moz-appearance: menulist;
    }

    .visuallyHidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        white-space: nowrap;
        width: 1px;
    }

    .businessFormContactHeader {
        font-size: 1.3rem;
        font-weight: bold;
        margin-top: 0.5rem;
        border-bottom: 1px solid var(--secondary-color);
    }

    .dateTimeInputWrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        input {
            &[type=time], &[type=date] {
                appearance: none;
    
                // For Chrome
                &::-webkit-calendar-picker-indicator {
                display: none;
                }
    
                // For Firefox (if needed, depending on the browser version and OS)
                &::-moz-calendar-picker-indicator {
                display: none;
                }
            }
        }  
    }

    .deleteButton {
        color: var(--error-color);
        background-color: transparent;
    }
    
    .formImage {
        width: 100%;
        max-width: 450px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem auto;
        
        @media (min-width: 500px) {
            width: 100%;
        }

        canvas {
            max-width: 100%;
            border: 1px solid var(--trim-color);
            display: block;
        }

        img {
            width: 100%;
            border: 1px solid var(--trim-color);
            display: block;
        }
    }

    .formCirclePreview {
        canvas {
            border-radius: 50%;
        }

        img {
            border-radius: 50%;
        }
    }

    .standardForm {
        width: 95%;
        max-width: 35rem;
        margin: 0.5rem auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 5px;
    }

    .inputWrapper {
        /* display: flex; */
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0.25rem 0 0.1rem;
    }

    .contactLabelWrapper {
        width: 100%;
        display: flex;
        gap: 0.5rem;
    }

    .formInput {
        width: 100%;
        font-size: 1.4rem;
        padding: 0.5rem 1rem;
        border: none;
        color: var(--input-text-color);
        border-radius: 5px;
        border-bottom: 1px solid black;
        background-color: var(--form-input-background);
        outline: none;

        ::placeholder {
            color: var(--input-placeholder);
        }

        ::autofill {
            background-color: blue;
        } 
    }

    .formRowSplit {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .formRowInputIcon {
        display: flex;
        justify-content: space-between;

        div {
            flex-grow: 1;
            margin-right: 0.5rem;
        }
    }

    .inputLabel {
        padding-top: 0.75rem;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .inputLabelInput {
        display: none;
    }

    .errormessage {
        width: 100%;
        font-size: 0.8rem;
        text-align: left;
        letter-spacing: 0.05rem;
        font-weight: bold;
        color: var(--error-color);
    }

    .formButtonWrapper {
        display: flex;
        justify-content: space-around;
        padding-top: 0.75rem;
    }

`;

export const Layout = (props) => {
    const { currentTheme } = useTheme()

    return (
        <ThemeProvider theme={currentTheme}>
            <GlobalStyle />
            <Styles>
                <div className='appContainer'>
                    <div className='innerContainer'>{props.children}</div>
                </div>
            </Styles>
        </ThemeProvider>
    )
}