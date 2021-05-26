import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';

import AxiosInstance from '../../helpers/axios';

import './eventCard.css';
import EventPreview from './eventPreview';

const EventCard = (props) => {
    const singleEvent = props.location.state.event;
    const eventStartTime = new Date(singleEvent.start);
    const eventEndTime = new Date(singleEvent.start);

    const [ locationEvents, setLocationEvents ] = useState([])
    const [ brandEvents, setBrandEvents ] = useState([])

    const getPageData = async () => {
        let atLocation = await AxiosInstance.get(`/events/location/${singleEvent.location_id}`)
        let withBrand = await AxiosInstance.get(`/events/brand/${singleEvent.brand_id}`)
        
        // remove current selected event from the event lists
        atLocation = atLocation.data.filter(event => event.id !== singleEvent.id)
        withBrand = withBrand.data.filter(event => singleEvent.id !== event.id)
        
        setLocationEvents(atLocation)
        setBrandEvents(withBrand)
    }

    useEffect(() => {
        getPageData()
        window.scrollTo(0,0);
        // eslint-disable-next-line
    }, [singleEvent]);

    return (
        <div className='eventWrapper'>
            <div className='singleEvent'>
                <h2>{singleEvent.eventname}</h2>
                <div className='datetimeInfo'>
                    <div>{format(eventStartTime, 'MMMM d, Y')}</div>
                    <div>{`${format(eventStartTime, 'h:mmaaa')} - ${format(eventEndTime, 'h:mmaaa')}`}</div>
                </div>
                <div className='imageWrapper'>
                    <img src={singleEvent.media} alt='temp for display help'/>
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
                            <EventPreview key={event.id} event={event} />
                        ))
                    }
                </div>
            }
            {brandEvents.length > 0 &&
                <div className='upcomingBrand'>
                    <h3 className='upcomingHeader'>{`more featuring ${singleEvent.name}...`}</h3>
                    {
                        brandEvents.map(event => (
                            <EventPreview key={event.id} event={event} />
                        ))
                    }
                </div>
            }
        </div>

    )
}

export default EventCard;
