import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';

import { SiteContext } from '../../context/site/site.provider';
import EventPreview from '../events/eventPreview';

import useEventsFilter from '../../hooks/useEventsFilter';


const UpcomingEventView = (props) => {
    const { useEventById } = useContext(SiteContext)
    const selectedEvent = useEventById(props.event);

    const atVenue = useEventsFilter({ venue_id: selectedEvent.venue_id, event_id: selectedEvent.event_id })
    const withBrand = useEventsFilter({ brand_id: selectedEvent.brand_id, event_id: selectedEvent.event_id })

    return (
        <React.Fragment>
            {
                ((selectedEvent.brand_id !== selectedEvent.venue_id) && (withBrand.length > 0)) &&
                    <Container>
                        <h3>{`upcoming events with ${selectedEvent.brand_name}`}</h3>
                        {withBrand.map(event => {
                            return (
                                <EventPreview key={event.event_id} event={event}/>
                            )
                        })}
                    </Container>
            }
            {
                (atVenue.length > 0) &&
                    <Container>
                        <h3>{`upcoming events at ${selectedEvent.venue_name}`}</h3>
                        {atVenue.map(event => {
                            return (
                                <EventPreview key={event.event_id} event={event}/>
                            )
                        })}
                    </Container>
            }
        </React.Fragment>
    )
}

export default UpcomingEventView;