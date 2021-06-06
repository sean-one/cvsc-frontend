import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helpers/axios';

import './editCreateEvent.css';

const EditCreateEvent = () => {
    const [ venueList, setVenueList ] = useState([])
    const [ brandList, setBrandList ] = useState([])

    const getBusinessInfo = async () => {
        const brands = await AxiosInstance.get('/business/brands');
        setBrandList(brands.data)
        const venues = await AxiosInstance.get('/business/venues');
        setVenueList(venues.data)
    }

    useEffect(() => {
        getBusinessInfo()
    }, []);

    return (
        <div className='createEvent'>
            <form className='createForm'>
                <label htmlFor='eventname'>Event Name:</label>
                <input type='text' id='eventname' name='eventname' />
                <label htmlFor='eventdate'>Event Date:</label>
                <input type='text' id='eventdate' name='eventdate' />
                <label htmlFor='start'>Start Time:</label>
                <input type='text' id='start' name='start' />
                <label htmlFor='end'>End Time:</label>
                <input type='text' id='end' name='end' />
                <label htmlFor='media'>Image Link:</label>
                <input type='text' id='media' name='media' />
                <label htmlFor='location'>Location:</label>
                <select id='location' name='location'>
                    {
                        venueList.map(venue => (
                            <option key={venue.id} value={venue.name} location={venue.location}>{venue.name}</option>
                        ))
                    }
                </select>
                <label htmlFor='details'>Event Details:</label>
                <input type='text' id='details' name='details' />
                <label htmlFor='brands'>Brand(s):</label>
                <select id='brands' name='brands'>
                    {
                        brandList.map(brand => (
                            <option key={brand.id} value={brand.name}>{brand.name}</option>
                        ))
                    }
                </select>
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default EditCreateEvent;