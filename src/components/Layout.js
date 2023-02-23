import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
    * {
        box-sizing: border-box;
    }

    .app_container {
        min-width: 250px;
        min-height: 100vh;
        max-width: 100vw;
        margin: 0;
        padding: 5rem 0.75rem 0 0.75rem;
        background-color: #588157;
        /* border: 2px solid yellow; */
        /* box-sizing: border-box; */
    }

    .innerContainer {
        width: calc(100vw - 1.5rem);
        min-width: 200px;
        max-width: 850px;
        margin: auto;
        box-sizing: border-box;
        /* border: 2px solid red; */
    }

    .calendarContainer {
        max-width: 550px;
        /* border: 2px solid pink; */
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

    .userAvatar {
        min-width: 100%;
        max-width: 325px;
    }
    .userCanvas {
        max-width: 100%;
    }

`;

export const Layout = (props) => {
    return (
        <Styles>
            <div className='app_container d-flex justify-content-center g-2'>
                <div>{props.children}</div>
            </div>
        </Styles>
    )
}