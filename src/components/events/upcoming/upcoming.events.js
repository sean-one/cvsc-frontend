import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';

import { SiteContext } from '../../../context/site/site.provider';
import EventPreview from '../eventPreview';


const UpcomingEvents = ({ event, venue_id, brand_id }) => {
    const { useUpcomingVenue, useUpcomingBrand } = useContext(SiteContext)
    const atVenue = useUpcomingVenue(venue_id, event.event_id)
    const withBrand = useUpcomingBrand(brand_id, event.event_id)

    
    return (
        <React.Fragment>
            {
                ((event.brand_id !== event.venue_id) && (withBrand.length > 0)) &&
                <Container>
                    <h3>{`upcoming events with ${event.brand_name}`}</h3>
                    {withBrand.map(event => {
                        return (
                            <EventPreview key={event.event_id} event={event} />
                        )
                    })}
                </Container>
            }
            {
                (atVenue.length > 0) &&
                <Container>
                    <h3>{`upcoming events at ${event.venue_name}`}</h3>
                    {atVenue.map(event => {
                        return (
                            <EventPreview key={event.event_id} event={event} />
                        )
                    })}
                </Container>
            }
        </React.Fragment>
    )
}

export default UpcomingEvents;