import React, { useContext } from 'react';

import EventPreview from '../eventPreview';

import { EventsContext } from '../../../context/events/events.provider';

const EventCardUpcoming = (props) => {
    const { events, getUpcomingEvents } = useContext(EventsContext);
    const { upcomingEvents, upcomingAtLocation, upcomingWithBrand } = getUpcomingEvents(events, props.event.venue_id, props.event.brand_id, props.event.event_id);
    
    return (
        <div>
            {
                (upcomingEvents) &&
                    <div>
                        <h3>more upcoming events</h3>
                        {upcomingEvents.map(event => {
                            return (
                                <EventPreview key={event.event_id} event={event}/>
                            )
                        })}
                    </div> 
            }
            {
                (upcomingAtLocation) && 
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
                (upcomingWithBrand) && 
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