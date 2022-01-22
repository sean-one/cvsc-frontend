import React, { useContext } from 'react';

import EventPreview from '../eventPreview';

import { SiteContext } from '../../../context/site/site.provider'

const EventCardUpcoming = (props) => {
    const { events } = useContext(SiteContext);
    const event = props.event
    
    const upcomingAtLocation = events.filter(e => (e.venue_id === event.venue_id) && (e.event_id !== event.event_id))
    const upcomingWithBrand = events.filter(e => (e.brand_id === event.brand_id) && (e.venue_id !== event.venue_id) && (e.event_id !== event.event_id))
    
    return (
        <div>
            {
                (upcomingAtLocation && upcomingAtLocation.length > 0) && 
                    <div>
                        <h3>{`more events at ${props.event.venue_name}`}</h3>
                        {upcomingAtLocation.map(event => {
                            return (
                                <EventPreview key={event.event_id} event={event}/>
                                )
                            })}
                    </div>    
            }
            {
                (upcomingWithBrand && upcomingWithBrand.length > 0) && 
                    <div>
                        <h3>{`more events with ${props.event.brand_name}`}</h3>
                        {upcomingWithBrand.map(event => {
                            return (
                                <EventPreview key={event.event_id} event={event}/>
                            )
                        })}
                    </div>    
            }
        </div>
    )
}

export default EventCardUpcoming;