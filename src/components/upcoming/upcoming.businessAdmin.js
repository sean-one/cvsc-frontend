import React from 'react';
import { Container, ListGroup, Row } from 'react-bootstrap';


const UpcomingBusinessAdmin = (props) => {
    return (
        <Row className='m-2 px-0'>
            <h4>Upcoming Events</h4>
            <ListGroup>
                <ListGroup.Item>event information and links</ListGroup.Item>
                <ListGroup.Item>event information and links</ListGroup.Item>
                <ListGroup.Item>event information and links</ListGroup.Item>
                <ListGroup.Item>event information and links</ListGroup.Item>
                <ListGroup.Item>event information and links</ListGroup.Item>
            </ListGroup>
        </Row>
    )
}

export default UpcomingBusinessAdmin;