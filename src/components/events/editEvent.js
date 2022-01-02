import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { reformatTime } from '../../helpers/formatTime';
import AxiosInstance from '../../helpers/axios';

import { SiteContext } from '../../context/site/site.provider';

const EditEvent = (props) => {
    const { useVenueList, useBrandList, updateEvent } = useContext(SiteContext)
    const venueList = useVenueList()
    const brandList = useBrandList()
    
    const { register, handleSubmit } = useForm();
    const currentEvent = props.location.state.event;
    const [ eventname, setEventname ] = useState(currentEvent.eventname);
    const [ eventdate, setEventdate ] = useState(format(new Date(currentEvent.eventdate), 'yyyy-MM-dd'));
    const [ eventstart, setEventstart ] = useState(reformatTime(currentEvent.eventstart));
    const [ eventend, setEventend ] = useState(reformatTime(currentEvent.eventend));
    const [ eventmedia, setEventmedia ] = useState(currentEvent.eventmedia);
    const [ venue, setVenue ] = useState(currentEvent.venue_id);
    const [ eventdetails, setEventDetails ] = useState(currentEvent.details);
    const [ brands, setBrands ] = useState(currentEvent.brand_id);
    
    let history = useHistory();

    const sendEvent = (event) => {
        const token = localStorage.getItem('token')
        // if this is not edited a string is returned
        if (isNaN(event.brand_id)) {
            event['brand_id'] = currentEvent.brand_id
        }
        // if this is not edited a string is returned
        if (isNaN(event.venue_id)) {
            event['venue_id'] = currentEvent.venue_id
        }
        AxiosInstance.put(`/events/${currentEvent.event_id}`, event, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                const updatedEvent = response.data
                if (response.status === 201) {
                    updateEvent(updatedEvent.event_id, updatedEvent)
                    history.push({
                        pathname: `/calendar/${currentEvent.event_id}`,
                        state: {
                            event: currentEvent
                        }
                    });
                } else {
                    console.log(response)
                    // throw new Error();
                }
            })
            .catch(err => {
                if (!err.response) {
                    console.log('network error')
                } else if (err.response.status === 400) {
                    localStorage.clear()
                    history.push('/login');
                } else if (err.response.status === 403) {
                    // setAdminRoleError(true);
                    console.log('403');
                }
            })
    }

    return (
        <div>
            <form onSubmit={handleSubmit((eventdata) => sendEvent(eventdata))}>
                <label htmlFor='eventname'>Event Name:</label>
                <input type='text' id='eventname' value={eventname} {...register('eventname')} required onChange={(e) => setEventname(e.target.value)} />
                <label htmlFor='eventdate'>Event Date:</label>
                <input type='date' id='eventdate' value={eventdate} {...register('eventdate')} required onChange={(e) => setEventdate(e.target.value)} />
                <label htmlFor='eventstart'>Start Time:</label>
                {/* <input type='time' id='eventstart' {...register('eventstart', { setValueAs: v => parseInt(v.replace(":", "")) })} required /> */}
                <input type='time' id='eventstart' value={eventstart} {...register('eventstart', { setValueAs: v => parseInt(v.replace(":", "")) })} required onChange={(e) => setEventstart(e.target.value)} />
                <label htmlFor='eventend'>End Time:</label>
                <input type='time' id='eventend' value={eventend} {...register('eventend', { setValueAs: v => parseInt(v.replace(":", "")) })} required onChange={(e) => setEventend(e.target.value)} />
                <img src={currentEvent.eventmedia} alt={currentEvent.eventname} />
                <label htmlFor='eventmedia'>Upload New Image:</label>
                <input type='text' id='eventmedia' value={eventmedia} {...register('eventmedia')} onChange={(e) => setEventmedia(e.target.value)} />
                <select id='venue_id' value={venue} {...register('venue_id', { valueAsNumber: true })} required onChange={(e) => setVenue(e.target.value)}>
                    {
                        venueList.map(venue => (
                            <option key={venue.id} value={venue.id}>{venue.name}</option>
                        ))
                    }
                </select>
                <label htmlFor='details'>Event Details:</label>
                <textarea type='text' id='details' value={eventdetails} {...register('details')} rows='10' onChange={(e) => setEventDetails(e.target.value)} />
                <label htmlFor='brands'>Brand(s):</label>
                <select id='brand_id' value={brands} {...register('brand_id', { valueAsNumber: true })} required onChange={(e) => setBrands(e.target.value)}>
                    {
                        brandList.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))
                    }
                </select>
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default EditEvent;