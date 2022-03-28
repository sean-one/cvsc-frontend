import React from 'react';
import { Container, Row } from 'react-bootstrap';

import EventPreview from '../events/eventPreview';
import useEventsFilter from '../../hooks/useEventsFilter';
import useBusinessFilter from '../../hooks/useBusinessFilter';


const UpcomingBusinessView = (props) => {
    const { business } = useBusinessFilter(props.business)
    const business_events = useEventsFilter({ business_id: props.business})
    
    return (
        <Container className='px-0'>
            <Row className='px-0 py-1'>
                <h3>{`Upcoming events with ${business.name}`}</h3>
            </Row>
            {
                business_events.map(event => {
                    return (
                        <EventPreview key={event.event_id} event={event}/>
                    )
                })
            }
        </Container>
    )
}

export default UpcomingBusinessView;