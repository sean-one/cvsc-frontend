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
        /* --trim-color: #1A1E1B; */
        /* --trim-color: #F4F6F5; */

        --form-input-background: #F4F6F5;
        --image-border: #263238;
        --input-text-color: #263238;
        /* --input-placeholder: #66BB6A; */
        --input-placeholder: #286237;
        
        --error-text-color: #D32F2F;
        --input-background-color: #4B6F51;
        --image-border-color: #DCDBC4;
        --image-box-shadow-color: #010A00;
        --max-page-width: 825px;
        --main-break-width: 500px;
        --site-icon-color: #DAD7CD;
        /* --site-icon-color: #58C46E; */
        --site-icon-size: 22px;
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
        margin: 0 0.25rem;
        padding: 1.5rem 0.5rem;
        border-radius: 5px;
        border: 1px solid var(--trim-color);
        margin-bottom: 0.75rem;
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
        color: #F4F6F5;
        border-radius: 5px;
        background-color: var(--trim-color);
        outline: none;
        
        :hover {
            /* background-color: #0D2B12; */
            /* border: 1px solid #4b6f51; */
        }

        :active {
            transform: translate(2px, 4px)
        }

        :disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background-color: transparent;
        }
    }
    
    .formImage {
        width: 100%;
        max-width: 350px;
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
        margin: 0.5rem auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 5px;
    }

    .inputWrapper {
        margin: 0.1rem 0;
    }

    .contactWrapper {
        border-radius: 5px;

        input {
            border-bottom: none;
            box-shadow: none;
        }
    }

    .contactLabelWrapper {
        display: flex;
        align-items: center;
    }

    .contactIcon {
        padding: 0.5rem;
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
        width: auto;
        /* margin: 0.5rem 0; */
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
        color: var(--error-text-color);
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