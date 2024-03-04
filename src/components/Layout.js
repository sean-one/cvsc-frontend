import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import useTheme from '../hooks/useTheme';

const GlobalStyle = createGlobalStyle`
    :root {
        --header-height: 7.5rem;
        --main-color: ${(props) => props.theme['--main-color']};
        --secondary-color: ${(props) => props.theme['--secondary-color']};
        --main-text-color: ${(props) => props.theme['--main-text-color']};
        --secondary-text-color: ${(props) => props.theme['--secondary-text-color']};
        --trim-color: #286237;
        --opacity: ${(props) => props.theme['--opacity']};
        --black-and-white: ${(props) => props.theme['--black-and-white']};
        --site-icon-size: 2.7rem;
        --contact-icon-size: 3.3rem;
        --error-color: #D32F2F;
        // added to label to make it look like an input for image upload
        --form-input-background: #F4F6F5;
        --input-text-color: #263238;
        --input-placeholder: #286237;
        
        --header-font-size: 2.4rem;
        --small-header-font: 1.8rem;
        --subheader-font-size: 1.8rem;
        --small-subheader-font: 1.5rem;
        --main-font-size: 1.65rem;
        --small-font: 1.35rem;
        --max-page-width: 52.5rem;
        --main-break-width: 500px;

    }
`;

const Styles = styled.div`
    .appContainer {
        min-width: 250px;
        min-height: 100vh;
        max-width: 100vw;
        font-size: var(--main-font-size);
        line-height: 1.3;
        color: var(--main-text-color);
        background-color: var(--main-color);
    }

    .headerText {
        font-size: var(--header-font-size);
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.05rem;
    }

    .smallHeaderText {
        font-size: var(--small-header-font);
        font-weight: bold;
        letter-spacing: 0.01rem;
        text-transform: uppercase;
    }
    
    .subheaderText {
        font-size: var(--subheader-font-size);
        font-weight: bold;
    }

    .smallSubheaderText {
        font-size: var(--small-subheader-font);
        font-weight: bold;
    }
    .smallText {}
    
    .innerContainer {
        padding: calc(var(--header-height) + 1.125rem) 0.75rem 0.75rem 0.75rem;
        box-sizing: border-box;
        
        @media (min-width: 500px) {
            max-width: var(--max-page-width);
            margin: 0 auto;
        }
    }

    .sectionContainer {
        margin: 0.75rem;
        padding: 0.75rem;
        border-radius: 5px;
        border: 1px solid var(--trim-color);
    }

    .sectionRowSplit {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .removeBorder {
        border: none;
    }

    button {
        padding: 0.75rem 1.875rem;
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
        font-size: 2.1rem;
        padding: 0.75rem 1.5rem;
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

    .roleWrapper {
        margin: 0.15rem 0;
        padding: 0.3rem 1.125rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-top: 1px dotted var(--main-text-color);
        border-bottom: 1px dotted var(--main-text-color);
    }

    .roleButtonWrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 0.75rem;
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

    .dateTimeInputWrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;

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
        margin: 1.5rem auto;
        
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
        max-width: 52.5rem;
        margin: 0.75rem auto;
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
        margin: 0.375rem 0 0.15rem;
    }

    .contactLabelWrapper {
        width: 100%;
        display: flex;
        gap: 0.75rem;
    }

    .formInput {
        width: 100%;
        font-size: 1.4rem;
        padding: 0.75rem 1.5rem;
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
            margin-right: 1.125rem;
        }
    }

    .inputLabel {
        padding-top: 1.125rem;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .inputLabelInput {
        display: none;
    }

    .removeInputLabelPadding {
        padding-top: 0;
        padding: 0;
    }

    .errormessage {
        width: 100%;
        font-size: 1.2rem;
        text-align: left;
        letter-spacing: 0.075rem;
        font-weight: bold;
        color: var(--error-color);
    }

    .imageError {
        text-align: right;
    }

    .formButtonWrapper {
        display: flex;
        justify-content: space-around;
        padding-top: 1.125rem;
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