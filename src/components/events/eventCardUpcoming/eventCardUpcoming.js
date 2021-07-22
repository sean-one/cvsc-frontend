import React, { useContext } from 'react';

import EventPreview from '../eventPreview';

import CalendarContext from '../../../context/calendarContext';

const EventCardUpcoming = (props) => {
    const { dailyEventList } = useContext(CalendarContext);
    let upcomingEvents = []
    let upcomingAtLocation = []
    let upcomingWithBrand = []
    if (props.event.brand_id === props.event.venue_id) {
        upcomingEvents = dailyEventList.filter(event => ((event.venue_id === props.event.brand_id || event.brand_id === props.event.brand_id) && event.event_id !== props.event.event_id))
    } else  {
        upcomingAtLocation = dailyEventList.filter(event => (event.venue_id === props.event.venue_id && event.event_id !== props.event.event_id))
        upcomingWithBrand = dailyEventList.filter(event => (event.brand_id === props.event.brand_id && event.event_id !== props.event.event_id))
    }
    
    return (
        <div>
            {
                (upcomingEvents.length > 0) &&
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
                (upcomingAtLocation.length > 0) && 
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
                (upcomingWithBrand.length > 0) && 
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