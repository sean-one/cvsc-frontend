import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
    * {
        box-sizing: border-box;
    }

    .app_container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 250px;
        min-height: 100vh;
        max-width: 100vw;
        margin: 0;
        padding: 2rem 0.75rem 0 0.75rem;
        color: black;
        background-color: #19381F;
    }
    
    .innerContainer {
        min-width: 200px;
        min-height: calc(100vh - 5rem);
        box-sizing: border-box;
        
        @media (min-width: 500px) {
            padding: 1rem;
            width: calc(100vw - 1.5rem);
            max-width: 700px;
            margin: auto;
            
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
        color: #DAD7CD;
        /* font-weight: bold; */
    }

    .inputError {
        border: 2px solid red;
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