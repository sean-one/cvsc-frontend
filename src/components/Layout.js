import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
    .app {
        min-height: 100vh;
        width: 100vw;
        background-color: #588157;
        padding-top: 6.5rem;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    .errormessage {
        width: 100%;
        text-align: left;
        padding: 0.25rem;
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
            <Container fluid className='app'>
                <Row className='px-3--md'>
                    {/* add 'd-lg-block' to class name to add to sides on larger screens */}
                    <Col xs={12} lg={2} className='d-none d-lg-block'>
                        {/* filter options area */}
                    </Col>
                    <Col xs={12} sm={12} lg={7}>
                        {props.children}
                    </Col>
                    <Col xs={12} lg={3} className='d-none d-lg-block'>
                        {/* bottom, right ad space area */}
                    </Col>
                </Row>
            </Container>
        </Styles>
    )
}