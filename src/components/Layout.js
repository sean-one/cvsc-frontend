import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
    .app {
        min-height: 100vh;
        background-color: #dad7cd;
        padding-top: 8.5rem;

    }

`;

export const Layout = (props) => {
    return (
        <Styles>
            <Container fluid className='app'>
                {props.children}
            </Container>
        </Styles>
    )
}