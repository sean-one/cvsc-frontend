import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
    * {
        box-sizing: border-box;
    }

    .app_container {
        min-height: 100vh;
        max-width: 100vw;
        margin: 0;
        padding: 6.5rem 0.75rem 0 0.75rem;
        background-color: #588157;
        /* border: 2px solid yellow; */
        /* box-sizing: border-box; */
    }

    .innerContainer {
        min-width: 375px;
        max-width: 850px;
        border: 2px solid red;
        /* margin: auto; */
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
        max-width: 325px;
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