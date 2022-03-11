import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
    .app {
        min-height: 100vh;
        background-color: #588157;
        padding-top: 7rem;

    }

`;

export const Layout = (props) => {
    return (
        <Styles>
            <Container fluid className='app'>
                <Row className='px-3--md'>
                    <Col sm={12} lg={2} className='d-none d-lg-block' style={{ border: 'dotted 1px red', height: '100vh' }}>
                        {/* filter options area */}
                    </Col>
                    <Col sm={12} lg={7}>
                        {props.children}
                    </Col>
                    <Col sm={12} lg={3} className='d-none d-lg-block' style={{ border: 'dotted 1px red', height: '100vh' }}>
                        {/* bottom, right ad space area */}
                    </Col>
                </Row>
            </Container>
        </Styles>
    )
}