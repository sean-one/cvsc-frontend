import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import './editCreateEvent.css';

const EditCreateEvent = () => {
    const [ venueList, setVenueList ] = useState([])
    const [ brandList, setBrandList ] = useState([])
    let history = useHistory();

    const getBusinessInfo = async () => {
        const brands = await AxiosInstance.get('/business/brands');
        setBrandList(brands.data)
        const venues = await AxiosInstance.get('/business/venues');
        setVenueList(venues.data)
    }

    useEffect(() => {
        getBusinessInfo()
    }, []);

    const sendEvent = (e) => {
        e.preventDefault();
        const eventDetails = {
            eventname: e.target.eventname.value,
            eventdate: e.target.eventdate.value,
            eventstart: parseInt(e.target.eventstart.value.replace(":", "")),
            eventend: parseInt(e.target.eventend.value.replace(":", "")),
            eventmedia: e.target.eventmedia.value,
            location_id: parseInt(e.target.location.value),
            details: e.target.details.value,
            brand_id: parseInt(e.target.brands.value),
            created_by: 1
        }
        AxiosInstance.post('/events', eventDetails)
            .then(response => {
                if(response.status === 200) {
                    history.push('/calendar');
                } else {
                    throw new Error();
                }
            })
            .catch(err => {
                console.log(err)
            })
        // console.log(eventDetails)
    }

    return (
        <div className='createEvent'>
            <form className='createForm' onSubmit={sendEvent}>
                <label htmlFor='eventname'>Event Name:</label>
                <input type='text' id='eventname' name='eventname' />
                <label htmlFor='eventdate'>Event Date:</label>
                <input type='date' id='eventdate' name='eventdate' />
                <label htmlFor='eventstart'>Start Time:</label>
                <input type='time' id='eventstart' name='eventstart' />
                <label htmlFor='eventend'>End Time:</label>
                <input type='time' id='eventend' name='eventend' />
                <label htmlFor='eventmedia'>Image Link:</label>
                <input type='url' id='eventmedia' name='eventmedia' />
                <label htmlFor='location'>Location:</label>
                <select id='location' name='location'>
                    {
                        venueList.map(venue => (
                            <option key={venue.id} value={venue.location}>{venue.name}</option>
                        ))
                    }
                </select>
                <label htmlFor='details'>Event Details:</label>
                <textarea type='text' id='details' name='details' rows='10' />
                <label htmlFor='brands'>Brand(s):</label>
                <select id='brands' name='brands'>
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

export default EditCreateEvent;