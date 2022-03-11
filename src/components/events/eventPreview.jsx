import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

import './eventPreview.css';
import AxiosInstance from '../../helpers/axios';
import { SiteContext } from '../../context/site/site.provider';
import { NotificationsContext } from '../../context/notifications/notifications.provider';

const EventPreview = (props) => {
    const event = props.event;
    const { removeEvent } = useContext(SiteContext)
    const { dispatch } = useContext(NotificationsContext)

    const detailPreview = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
    }

    const delEvent = (eventId) => {
        const token = localStorage.getItem('token')
        AxiosInstance.delete(`/events/remove/${eventId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                removeEvent(eventId)
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'event has been removed'
                    }
                })
            })
            .catch(err => {
                console.log('something went wrong')
            })
    }
    
    return (
        <Card className='my-3'>
            <Row className='gx-4'>
                <Col md={4} className='mx-auto'>
                    <Card.Img variant='top' src={event.eventmedia} />
                </Col>
                <Col md={8}>
                    <Card.Body>
                        <Card.Title>{event.eventname.toUpperCase()}</Card.Title>
                        <Card.Subtitle>
                            <Link to={{
                                pathname: `/business/${event.venue_id}`
                            }}>{`at ${event.venue_name}`}</Link>
                        </Card.Subtitle>
                        <Card.Text>
                            {detailPreview(event.details, 100)}
                        </Card.Text>
                        <Link to={{
                            pathname: `/event/${event.event_id}`,
                            state: {
                                event,
                                from: props.location.pathname
                            }
                        }}>Read More</Link>
                    </Card.Body>
                </Col>
            </Row>
            <Card.Footer className='d-flex justify-around'>
                <Col>{event.brand_name}</Col>
                <Col>{event.city}</Col>
                {
                    (event.created_by === parseInt(localStorage.getItem('userId'))) &&
                        <Col>
                            <Row>
                                <Col><Link to={{
                                    pathname: `/events/edit/${event.event_id}`,
                                    state: {
                                        event,
                                        from: props.location.pathname
                                    }
                                }}>edit</Link></Col>
                                <Col onClick={() => delEvent(event.event_id)}>del</Col>
                            </Row>
                        </Col>
                }
            </Card.Footer>
        </Card>
    )
}

export default withRouter(EventPreview);