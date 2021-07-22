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
        // console.log(upcomingEvents)
    } else  {
        upcomingAtLocation = dailyEventList.filter(event => (event.venue_id === props.event.venue_id && event.event_id !== props.event.event_id))
        upcomingWithBrand = dailyEventList.filter(event => (event.brand_id === props.event.brand_id && event.event_id !== props.event.event_id))
        // console.log(upcomingAtLocation)
        // console.log(upcomingWithBrand)
    }
    console.log(upcomingEvents)
    return (
        <div>
            {
                (upcomingEvents.length > 0) &&
                    <div>
                        <h2>more upcoming events</h2>
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
                        <h2>{`more events at ${props.event.venue_name}`}</h2>
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
                        <h2>{`more events with ${props.event.brand_name}`}</h2>
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