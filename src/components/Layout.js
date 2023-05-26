import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const theme = {

}

const GlobalStyle = createGlobalStyle`
    :root {
        --header-height: 4.5rem;
        --header-background-color: #CBD4BA;
        --main-text-color: #DAD7CD;
        --background-color: #19381f;
        --error-text-color: #58C46E;
        --box-shadow-color: #0D2B12;
        --input-text-color: #010A00;
        --input-background-color: #4B6F51;
        --image-border-color: #DCDBC4;
        --image-box-shadow-color: #010A00;
        --page-wrapper-background-color: rgba(75,111,81,0.3);
        --max-page-width: 825px;
        --main-break-width: 500px;
        --site-icon-color: #58C46E;
        --site-icon-size: 24px;
    }
`;

const Styles = styled.div`
    .app_container {
        min-width: 250px;
        min-height: 100vh;
        max-width: 100vw;
        color: var(--main-text-color);
        background-color: var(--background-color);
    }
    
    .innerContainer {
        padding: calc(var(--header-height) + 0.75rem) 0 0.5rem 0;
        display: flex;
        justify-content: center;
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
        border: 1px solid #010a00;
        color: #dcdbc4;
        border-radius: 5px;
        background-color: transparent;
        outline: none;
        /* margin: 0 1rem; */
        
        :hover {
            background-color: #0D2B12;
            border: 1px solid #4b6f51;
        }

        :active {
            transform: translate(2px, 4px)
        }

        :disabled {
            opacity: 0.6;
            cursor: not-allowed;
            /* background-color: red; */
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

    .formButtonWrapper {
        margin-top: 1.5rem;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .formButton {
        margin: 0 1rem;
    }

    .dateTimeWrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;

        @media(min-width: 440px) {
            flex-direction: row;
            justify-content: space-between;

        }
    }

    .timeWrapper{
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        gap: 10px;

        @media(min-width: 440px) {
            margin-bottom: 0;
        }
    }

    .icon-button {
        cursor: pointer;
    }

    .errormessage {
        width: 100%;
        text-align: left;
        /* padding: 0.25rem; */
        /* color: #8f0c0c; */
        color: var(--error-text-color);
        /* font-weight: bold; */
    }

`;

export const Layout = (props) => {
    return (
        <Styles theme={theme}>
            <GlobalStyle />
            <div className='app_container'>
                <div className='innerContainer'>{props.children}</div>
            </div>
        </Styles>
    )
}