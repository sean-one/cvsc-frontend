import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import useTheme from '../hooks/useTheme';

// trim-color with opacity 'rgba(40,98,55,1)'
// #F0F0F0
// #006633 rgba(0,102,51,1)
// #D9EAD3
// #202020
// #004D40
// #39403A


const GlobalStyle = createGlobalStyle`
    :root {
        --main-background-color: ${(props) => props.theme['--main-background-color']};
        --main-highlight-color: ${(props) => props.theme['--main-highlight-color']};
        --header-highlight: ${(props) => props.theme['--header-highlight']};
        --max-image-size: 45rem;
        --max-circle-image: 35rem;
        --header-height: 9.5rem;
        --main-color: #006633;
        --max-section-width: 55rem;
        --max-page-width: 108rem;
        --input-placeholder: #39403A;
        --icon-size: 2.5rem;
        --site-icon-size: 3rem;
        --contact-icon-size: 3.3rem;
        --error-color: #D32F2F;
        --notification-background: #D9EAD3;
        --opacity: ${(props) => props.theme['--opacity']};

        
        --header-font-size: 2.4rem;
        --small-header-font: 1.8rem;
        --subheader-font-size: 1.8rem;
        --small-subheader-font: 1.5rem;
        --main-font-size: 1.65rem;
        --small-font: 1.35rem;
        --main-break-width: 50rem;

    }
`;

const Styles = styled.div`
    .appContainer {
        width: 100%;
        display: flex;
        justify-content: center;
        min-width: 25rem;
        min-height: 100vh;
        max-width: 100vw;
        font-size: var(--main-font-size);
        line-height: 1.3;
        color: var(--main-color);
        background-color: var(--main-background-color);
    }

    .innerContainer {
        width: 100%;
        margin-top: var(--header-height);
        padding-top: 1.125rem;
        max-width: var(--max-page-width);   
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

    .smallText {
        font-size: var(--small-font);
        font-weight: lighter;
    }

    .siteIcons {
        font-size: var(--icon-size);
    }

    button {
        padding: 0.75rem 1.875rem;
        border: none;
        border: 0.1rem solid var(--main-highlight-color);
        color: var(--main-color);
        border-radius: 5px;
        background-color: transparent;
        outline: none;

        :active {
            transform: translate(2px, 4px)
        }

        :disabled {
            color: var(--error-color);
            border: 0.1rem solid var(--error-color);
            opacity: 0.6;
            cursor: not-allowed;
            background-color: transparent;
        }
    }

    input, textarea, select {
        width: 100%;
        font-size: 2.1rem;
        padding: 0.75rem 1.5rem 0.25rem;
        margin: 0; 
        border: none; 
        border-radius: 0;
        outline: none;
        appearance: none; /* For modern browsers */
        -webkit-appearance: none; /* For older versions of Safari */
        -moz-appearance: none; /* For Firefox */
        background: transparent;
        font-family: inherit; /* Inherit font from parent elements */
        background: var(--background-color);
        border-bottom: 0.1rem solid var(--main-color);
        color: var(--main-color);

        ::placeholder {
            color: var(--input-placeholder);
        }
    }

    select, textarea {
        appearance: auto;
        -webkit-appearance: menulist;
        -moz-appearance: menulist;
    }

    textarea {
        margin-top: 1rem;
        border-radius: 0.25rem;
        border: 0.1rem solid var(--main-color);
    }

    // address.form.js
    input[type="checkbox"] {
        width: auto; // Revert to default width
        font-size: medium; // Reset to default font size, though this doesn't usually affect checkboxes
        padding: 0; // Remove padding
        margin: 0; // Keep margin as 0 if you want, as this usually doesn't affect the checkbox appearance
        border: initial; // Return to default border
        border-radius: initial; // Remove border-radius
        outline: revert; // Use the browser's default outline
        appearance: auto; /* Reset appearance to default */
        -webkit-appearance: checkbox; /* Specifically for Safari */
        -moz-appearance: checkbox; /* Specifically for Firefox */
        background: initial; // Reset background to default
        font-family: inherit; // This doesn't affect checkboxes, but can be left as is
        border-bottom: initial; // Reset any border modifications
        color: initial; // Reset text color to default, though this doesn't usually affect checkboxes
    }

    // user.roles.js, inactive.roles.js, creator.roles.js, manager.roles.js, pending.roles.js
    .rolesListSection {
        width: 100%;
        /* max-width: var(--max-section-width); */
        margin-bottom: 1rem;
    }
    
    // user.roles.js, inactive.roles.js, creator.roles.js, manager.roles.js, pending.roles.js
    .rolesListSectionHeader {
        width: 100%;
        height: 4.5rem;
        border-radius: 0.5rem;
        color: var(--main-background-color);
        background-color: var(--main-highlight-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        margin: 0.25rem 0;

        svg {
            color: var(--main-background-color);
        }
    }

    // business.role.js & user.role.js
    .roleWrapper {
        width: 100%;
        padding: 0.75rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-top: 1px dotted var(--main-color);
        border-bottom: 1px dotted var(--main-color);
    }

    // business.role.js & user.role.js
    .roleButtonWrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;
    }

    // event.create.form.js
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

    // event.create.form.js
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

    // register.jsx, user.edit.form.js, businessView.js, business.create.form.js, business.edit.form.js, business.admin.view.js
    .imagePreview {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1.5rem auto;
        
        img {
            max-width: 100%;
            border: 0.3rem solid var(--main-color);
            display: block;
            /* box-shadow: 5px 5px 5px var(--main-highlight-color); */
        }
    }
    
    // register.jsx, user.edit.form.js, businessView.js, business.create.form.js, business.edit.form.js, business.admin.view.js
    .profileImage, .businessImage {
        max-width: var(--max-circle-image);

        img {
            border-radius: 50%
        }
    }

    // event.create.form.js, event.view.js
    .eventImage {
        max-width: var(--max-image-size);
    }

    // register.js, login.js, business.create.form.js, business.edit.form.js, event.create.form.js
    .standardForm {
        width: 95%;
        max-width: 52.5rem;
        margin: 0.75rem auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 5px;
    }

    // register.js, login.js, business.create.form.js, business.edit.form.js, event.create.form.js
    .inputWrapper {
        /* display: flex; */
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0.375rem 0 0.15rem;
    }

    // business.create.form.js, business.edit.form.js
    .contactLabelWrapper {
        /* width: 100%;
        display: flex;
        gap: 0.75rem; */
    }

    // register.js, business.create.form.js, business.edit.form.js, event.create.form.js
    .formRowInputIcon {
        display: flex;
        justify-content: space-between;

        div {
            flex-grow: 1;
            margin-right: 1.125rem;
        }
    }

    // register.js, business.create.form.js, business.edit.form.js, event.create.form.js
    .inputLabel {
        padding-top: 1.125rem;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    // register.js, business.create.form.js, business.edit.form.js, event.create.form.js
    .inputLabelInput {
        display: none;
    }

    // business.edit.form.js - removes top padding from camera icon
    .removeInputLabelPadding {
        padding-top: 0;
        padding: 0;
    }

    // register.js, login.js, business.create.form.js, address.form.js, event.create.form.js
    .errormessage {
        width: 100%;
        font-size: 1.2rem;
        text-align: left;
        letter-spacing: 0.075rem;
        font-weight: bold;
        color: var(--error-color);
    }

    // business.create.form.js, event.create.form.js
    .imageError {
        text-align: right;
    }

    // register.js, login.js, business.create.form.js, business.edit.form.js, event.create.form.js
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