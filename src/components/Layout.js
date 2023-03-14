import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
    * {
        box-sizing: border-box;
    }

    .app_container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        min-width: 250px;
        min-height: 100vh;
        max-width: 100vw;
        margin: 0;
        padding: 4.5rem 0.75rem 0 0.75rem;
        color: #DAD7CD;
        background-color: #19381F;
    }
    
    .innerContainer {
        min-width: 200px;
        box-sizing: border-box;
        
        @media (min-width: 500px) {
            padding: 1rem;
            width: calc(100vw - 1.5rem);
            max-width: 700px;
            margin: 0 auto;
        }
    }

    .centerElement {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .fullCalendar {
        width: calc(100vw - 1.5rem);
        max-width: 1280px;
        box-sizing: border-box;
    }

    .weekDay {
        height: 145px;
    }

    .daysPast {
        background-color: rgba(0,0,0,0.4);
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    input, select, textarea {
        margin: 0.5rem 0;
        width: 100%;
        padding: 0.5rem;
        border: none;
        color: #010a00;
        border-radius: 5px;
        border-bottom: 1px solid black;
        background-color: #4B6F51;
        box-shadow: 5px 5px 5px #0D2B12;
        outline: none;
        
        ::placeholder {
            color: #DAD7CD;
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
    }

    /* used in contact input of forminput.js */
    .labelWrapper {
        display: flex;
        align-items: center;
        
        div {
            width: 15%;
            
            @media(min-width: 400px) {
                width: 10%;
            }
        }
    }
    
    /* used in contact input of forminput.js */
    .labelIcon {
        margin: 0 0.5rem;
        width: 1rem;
    }
    
    .inputErrorWrapper {
        display: flex;
        flex-direction: column;
    }
    
    .imageUpdateInput {
        margin: 0.25rem 0;
        cursor: pointer;
        width: 100%;
        padding: 0.5rem;
        border: none;
        color: #DAD7CD;
        border-radius: 5px;
        border-bottom: 1px solid black;
        background-color: #4B6F51;
        box-shadow: 5px 5px 5px #0D2B12;
        outline: none;
        text-align: center;

        .cameraIcon {
            color: #DAD7CD;
            margin-left: 0.25rem;
        }

        input {
            display: none;
        }
    }

    .updateCheckbox {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        
        input[type=checkbox] {
            width: 1rem;
            height: 1rem;
            margin: 0;
            margin-right: 0.25rem;
            padding: 0;
        }
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

    .inputErrorWrapper {
        width: 100%;
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

    .event-card-title {
        font-weight: bold;
        color: darkgreen;
        text-transform: capitalize;
    }

    .icon-button {
        cursor: pointer;
    }

    .errormessage {
        width: 100%;
        text-align: left;
        /* padding: 0.25rem; */
        /* color: #8f0c0c; */
        color: #DAD7CD;
        /* font-weight: bold; */
    }

    .inputError {
        border-bottom: 2px solid #DAD7CD;
    }

`;

export const Layout = (props) => {
    return (
        <Styles>
            <div className='app_container'>
                <div className='innerContainer'>{props.children}</div>
            </div>
        </Styles>
    )
}