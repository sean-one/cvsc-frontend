import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import useTheme from '../hooks/useTheme';

const GlobalStyle = createGlobalStyle`
    :root {
        --header-height: 4.5rem;
        --main-text-color: #4CAF50;
        --secondary-text-color: ${(props) => props.theme['--secondary-text-color']};
        --background-color: ${(props) => props.theme['--background-color']};
        --card-background-color: #607D8B;
        --form-input-background: #607D8B;
        --image-border: #263238;
        --input-text-color: #263238;
        --input-placeholder: #66BB6A;
        
        --error-text-color: ${(props) => props.theme['--error-text-color']};
        --box-shadow-color: #263238;
        --input-background-color: #4B6F51;
        --image-border-color: #DCDBC4;
        --image-box-shadow-color: #010A00;
        --page-wrapper-background-color: rgba(75,111,81,0.3);
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
        background-color: var(--background-color);
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
    
    button {
        padding: 0.5rem 1.25rem;
        border: none;
        border: 1px solid var(--secondary-text-color);
        color: var(--secondary-text-color);
        border-radius: 5px;
        background-color: var(--main-text-color);
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
            border: 1px solid #dcdbc4;
            display: block;
            box-shadow: 5px 5px 5px #010a00;
        }

        img {
            width: 100%;
            border: 1px solid #dcdbc4;
            display: block;
            box-shadow: 5px 5px 5px #010a00;
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
        background-color: var(--input-background-color);
        border-radius: 5px;
        box-shadow: 3px 2px 1px 0 var(--box-shadow-color);
        border-bottom: 1px solid black;

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
        /* background-color: var(--input-background-color); */
        box-shadow: 3px 2px 1px 0 var(--box-shadow-color);
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

    .rolesListWrapper {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border: 1px solid #263238;
        box-shadow: 5px 5px 5px var(--box-shadow-color);
        border-radius: 5px;
    }

    .rolesListHeader {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        letter-spacing: 0.1rem;
        border-bottom: 2px solid black;
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