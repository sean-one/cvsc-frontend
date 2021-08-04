import React, { useState, useEffect, useContext } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventSchema } from '../../helpers/validationSchemas';
// import { format } from 'date-fns';
import AxiosInstance from '../../helpers/axios';

import UserContext from '../../context/userContext';

import './createEvent.css';

const CreateEvent = (props) => {
    const { register, handleSubmit, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(createEventSchema)
    });
    const { userEvents, setUserEvents } = useContext(UserContext)
    const [ adminRoleError, setAdminRoleError ] = useState(false);
    const [ networkError, setNetworkError ] = useState(false);
    const [ venueList, setVenueList ] = useState([])
    const [ brandList, setBrandList ] = useState([])
    let history = useHistory();

    useEffect(() => {
        async function getBusinessInfo() {
            try {
                const venues = await AxiosInstance.get('/business/venues')
                const brands = await AxiosInstance.get('/business/brands')
                setVenueList(venues.data)
                setBrandList(brands.data)
                return
            } catch (error) {
                setNetworkError(true);
            }
        }
        getBusinessInfo()
    }, [setVenueList, setBrandList]);

    const sendEvent = async (data) => {
        // console.log(data.eventmedia[0])
        const token = localStorage.getItem('token')
        const file = data.eventmedia[0]

        if (file === undefined) {
            // this needs to create an error and stop the post.  this file is required
            const imageUrl = 'https://picsum.photos/300/400'
            data.eventmedia = imageUrl

        } else {

            // get s3 url from server
            const url = await AxiosInstance.get('/s3')
                .then(response => {
                    return response.data.url
                })
                .catch(err => console.log(err))
            
            await AxiosInstance.put(url, file, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            const imageUrl = url.split('?')[0]
            data.eventmedia = imageUrl
        }

        AxiosInstance.post('/events', data, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                if(response.status === 200) {
                    setUserEvents([...userEvents], response.data)
                    history.push({
                        pathname: `/calendar/${response.data.event_id}`,
                        state: {
                            event: response.data
                        }
                    });
                } else {
                    console.log(response)
                    // throw new Error();
                }
            })
            .catch(err => {
                if(!err.response) {
                    console.log('network error')
                } else if(err.response.status === 400) {
                    localStorage.clear()
                    history.push('/login');
                } else if(err.response.status === 403) {
                    setAdminRoleError(true);
                }
            })
    }

    return (
        <div className='formWrapper'>
            {/* <form className='createForm' onSubmit={sendEvent}> */}
            <form className='createForm' onSubmit={handleSubmit(sendEvent)}>
                <label htmlFor='eventname'>Event Name:</label>
                <input
                    {...register('eventname')}
                    type='text'
                    id='eventname'
                    required
                />
                <p className='errormessage'>{errors.eventname?.message}</p>
                <label htmlFor='eventdate'>Event Date:</label>
                <input
                    type='date'
                    id='eventdate'
                    {...register('eventdate')}
                    required
                />
                <p className='errormessage'>{errors.eventdate?.message}</p>
                <label htmlFor='eventstart'>Start Time:</label>
                {/* <input type='time' id='eventstart' {...register('eventstart', { setValueAs: v => parseInt(v.replace(":", "")) })} required /> */}
                <input
                    {...register('eventstart', { setValueAs: v => parseInt(v.replace(":", "")) })}
                    type='time'
                    id='eventstart'
                    required
                />
                <p className='errormessage'>{errors.eventstart?.message}</p>
                <label htmlFor='eventend'>End Time:</label>
                <input
                    {...register('eventend', { setValueAs: v => parseInt(v.replace(":", "")) })}
                    type='time'
                    id='eventend'
                    required
                />
                <p className='errormessage'>{errors.eventend?.message}</p>
                <label htmlFor='eventmedia'>Image Link:</label>
                <input
                    {...register('eventmedia')}
                    type='file'
                    id='eventmedia'
                    accept='image/*'
                />
                <p className='errormessage'>{errors.eventmedia?.message}</p>
                <label htmlFor='venue_id'>Location:</label>
                <select id='venue_id' {...register('venue_id', { valueAsNumber: true })} required >
                    <option value="0">Select...</option>
                    {
                        venueList.map(venue => (
                            <option key={venue.id} value={venue.id}>{venue.name}</option>
                            ))
                        }
                </select>
                <p className='errormessage'>{errors.venue_id?.message}</p>
                {adminRoleError && <p className='errormessage'>must have admin rights to at least one</p>}
                <label htmlFor='details'>Event Details:</label>
                <textarea
                    {...register('details')}
                    type='text'
                    id='details'
                    rows='10'
                />
                <p className='errormessage'>{errors.details?.message}</p>
                <label htmlFor='brands'>Brand(s):</label>
                <select id='brand_id' {...register('brand_id', { valueAsNumber: true })} required >
                    <option value="0">Select...</option>
                    {
                        brandList.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))
                        }
                </select>
                <p className='errormessage'>{errors.brand_id?.message}</p>
                {adminRoleError && <p className='errormessage'>must have admin rights to at least one</p>}
                {networkError && <p className='errormessage networkerror'>must be online to create a new event</p>}
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default withRouter(CreateEvent);