import React, { useState, useContext, useEffect } from 'react'
import { format } from 'date-fns';

import AxiosInstance from '../../helpers/axios';
import formatTime from '../../helpers/formatTime.js';

import './eventCard.css';
import EventPreview from './eventPreview';

import CalendarContext from '../../context/calendarContext';

const EventCard = (props) => {
    const { dailyEventList } = useContext(CalendarContext);
    const singleEvent = props.location.state.event;
    const eventDate = new Date(singleEvent.eventdate);

    const [ locationEvents, setLocationEvents ] = useState([])
    const [ brandEvents, setBrandEvents ] = useState([])

    const getPageData = async () => {
        let atLocation = await AxiosInstance.get(`/events/location/${singleEvent.venue_id}`)
        let withBrand = await AxiosInstance.get(`/events/brand/${singleEvent.brand_id}`)
        
        // remove current selected event from the event lists
        atLocation = atLocation.data.filter(event => event.event_id !== singleEvent.event_id)
        withBrand = withBrand.data.filter(event => singleEvent.event_id !== event.event_id)
        
        setLocationEvents(atLocation)
        setBrandEvents(withBrand)
    }

    useEffect(() => {
        getPageData()
        window.scrollTo(0,0);
        // eslint-disable-next-line
    }, [singleEvent]);

    const venueEvents = dailyEventList.filter(event => event.venue_id === singleEvent.venue_id);
    const filteredBrand = dailyEventList.filter(event => event.brand_id === singleEvent.brand_id);

    console.log(venueEvents)
    console.log(filteredBrand)
    return (
        <div className='eventWrapper'>
            <div className='singleEvent'>
                <h2>{singleEvent.eventname}</h2>
                <div className='datetimeInfo'>
                    <div>{format(eventDate, 'MMMM d, Y')}</div>
                    <div>{`${formatTime(singleEvent.eventstart)} - ${formatTime(singleEvent.eventend)}`}</div>
                </div>
                <div className='imageWrapper'>
                    <img src={singleEvent.eventmedia} alt='temp for display help'/>
                </div>
                <div className='addressInfo'>
                    <p>{singleEvent.formatted}</p>
                </div>
                <div>{singleEvent.details}</div>
            </div>
            {locationEvents.length > 0 &&
                <div className='upcomingLocation'>
                    <h3 className='upcomingHeader'>{`more at ${singleEvent.venue_name}...`}</h3>
                    {
                        locationEvents.map(event => (
                            <EventPreview key={event.event_id} event={event} />
                        ))
                    }
                </div>
            }
            {brandEvents.length > 0 &&
                <div className='upcomingBrand'>
                    <h3 className='upcomingHeader'>{`more featuring ${singleEvent.brand_name}...`}</h3>
                    {
                        brandEvents.map(event => (
                            <EventPreview key={event.event_id} event={event} />
                        ))
                    }
                </div>
            }
        </div>

    )
}

export default EventCard;
