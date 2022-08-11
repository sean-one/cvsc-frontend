import React from 'react';
import { Container, Col } from 'react-bootstrap';
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
        /* box-sizing: border-box; */
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
            <Container fluid className='app_container d-flex justify-content-center g-2'>
                {/* add 'd-lg-block' to class name to add to sides on larger screens */}
                <Col xs={12} lg={3} className='d-none d-lg-block border'>
                    {/* filter options area */}
                    ad space
                </Col>
                <Col xs={12} sm={12} lg={6}>
                    {props.children}
                </Col>
                <Col xs={12} lg={3} className='d-none d-lg-block border'>
                    {/* bottom, right ad space area */}
                    ad space
                </Col>
            </Container>
        </Styles>
    )
}