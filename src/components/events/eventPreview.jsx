import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Card, Container, Row, Col, Image } from 'react-bootstrap';

import './eventPreview.css';

const EventPreview = (props) => {
    const event = props.event;

    const detailPreview = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
    }
    
    return (
        <React.Fragment>
            <Container className='my-3'>
                <Card>
                    <Row className='gx-4'>
                        <Col md={4} className='mx-auto'>
                            <Card.Img src={event.eventmedia} />
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
                                    pathname: `/events/${event.event_id}`,
                                    state: {
                                        event,
                                        from: props.location.pathname
                                    }
                                }}>Read More</Link>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </React.Fragment>
        // <div className='eventCard' key={event.event_id}>
        //     <div className='cardImg' style={{backgroundImage: `url(${event.eventmedia})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
        //         {/* <img src={event.eventmedia} alt={`upcoming event - ${event.eventname}`} /> */}
        //     </div>
        //     <div className='cardInfo'>
        //         <div className='cardTitle'>
        //             <p>{event.eventname}</p>
        //         </div>
        //         <div className='cardLocation'>
        //             <Link to={{
        //                 pathname:`/business/${event.venue_id}`,
        //                 state: {
        //                     from: props.location.pathname
        //                 }
        //             }}>
        //                 <p>{`${event.brand_name} at ${event.venue_name}`}</p>
        //             </Link>
        //         </div>
        //         <div className='cardDetails'>
        //             <p>{detailPreview(event.details, 100)}</p>
        //         </div>
        //         <div className='brand'>
        //             <Link to={{
        //                 pathname: `/business/${event.brand_id}`,
        //                 state: {
        //                     from: props.location.pathname
        //                 }
        //             }}>
        //             <p>{event.brand_name}</p>
        //             </Link>
        //         </div>
        //         <div className='eventLinkButton'>
        //             <Link to={{
        //                 pathname: `/calendar/${event.event_id}`,
        //                 state: {
        //                     event,
        //                     from: props.location.pathname
        //                 }
        //             }}><div>more</div>
        //             </Link>
        //         </div>
        //     </div>
        //     <div className='cardTime'>
        //         <p>{`${event.eventstart} - ${event.eventend}`}</p>
        //     </div>
        // </div>
    )
}

export default withRouter(EventPreview);