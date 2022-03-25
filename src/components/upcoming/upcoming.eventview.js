import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';

import { SiteContext } from '../../context/site/site.provider';
import EventPreview from '../events/eventPreview';


const UpcomingEventView = (props) => {
    const { useEventById, events } = useContext(SiteContext)
    const selectedEvent = useEventById(props.event);

    const atVenue = events.filter(e => (e.venue_id === selectedEvent.venue_id) && (e.event_id !== selectedEvent.event_id))
    const withBrand = events.filter(e => (e.brand_id === selectedEvent.brand_id) && (e.venue_id !== selectedEvent.venue_id) && (e.event_id !== selectedEvent.event_id))    

    return (
        <React.Fragment>
            {
                (selectedEvent.brand_id !== selectedEvent.venue_id) &&
                    <Container>
                        <h3>{`upcoming events with ${selectedEvent.brand_name}`}</h3>
                        {withBrand.map(event => {
                            return (
                                <EventPreview key={event.event_id} event={event}/>
                            )
                        })}
                    </Container>
            }
            <Container>
                <h3>{`upcoming events at ${selectedEvent.venue_name}`}</h3>
                {atVenue.map(event => {
                    return (
                        <EventPreview key={event.event_id} event={event}/>
                    )
                })}
            </Container>
        </React.Fragment>
    )
}

export default UpcomingEventView;