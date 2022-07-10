import React, { useContext } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventSchema } from '../../helpers/validationSchemas';
import { Button, Form, Row } from 'react-bootstrap';
import AxiosInstance from '../../helpers/axios';

import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { useAddEventMutation } from '../../hooks/useEvents';
import { NotificationsContext } from '../../context/notifications/notifications.provider';
import { UsersContext } from '../../context/users/users.provider';
import useImagePreviewer from '../../hooks/useImagePreviewer';


const CreateEvent = () => {
    const { data: business_list, isLoading: loadingBusinessList } = useBusinessesQuery()
    const { editImage, imagePreview, canvas } = useImagePreviewer()
    const { mutateAsync: addEventMutation } = useAddEventMutation()
    const { dispatch } = useContext(NotificationsContext);
    const { useRoleBusinessIds_Active } = useContext(UsersContext)
    const business_roles = useRoleBusinessIds_Active()
    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(createEventSchema)
    });
    
    let history = useHistory();

    if(loadingBusinessList) {
        return <div>loading...</div>
    }

    const venue_list = business_list.data.filter(business => business.business_type !== 'brand' && business.active_business === true)
    const brand_list = business_list.data.filter(business => business.business_type !== 'venue' && business.active_business === true)

    const createNewEvent = async (data) => {
        try {
            canvas.current.toBlob(async function(blob) {
                const token = localStorage.getItem('token')
    
                // get image url from s3 bucket
                const url = await AxiosInstance.get('/s3', { headers: { 'Authorization': 'Bearer ' + token } })
                    .then(response => {
                        return response.data.url
                    })
                    .catch(err => console.log(err))
                
                // upload the image to the s3 bucket at the url recieved
                await AxiosInstance.put(url, blob, { headers: { 'Content-Type': 'multipart/form-data' }})
    
                const imageUrl = url.split('?')[0]
                
                data.eventmedia = imageUrl
                
                const add_event_response = await addEventMutation(data)

                if(add_event_response.status === 201) {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: `event '${add_event_response.data.eventname}' has been created`
                        }
                    })
                    history.push({
                        pathname: `/event/${add_event_response.data.event_id}`,
                        state: {
                            event: add_event_response.data
                        }
                    });
                } else {
                    console.log('sumtins no rite')
                    //             dispatch({
                    //                 type: "ADD_NOTIFICATION",
                    //                 payload: {
                    //                     notification_type: 'ERROR',
                    //                     message: 'server error, please wait and try again'
                    //                 }
                    //             })

                    //         (err.response.status === 403 || err.response.status === 400) {
                    //             setError(`${err.response.data.type}`, {
                    //                 type: 'server',
                    //                 message: `${err.response.data.message}`
                    //             })
                    //             dispatch({
                    //                 type: "ADD_NOTIFICATION",
                    //                 payload: {
                    //                     notification_type: 'ERROR',
                    //                     message: `${err.response.data.message}`
                    //                 }
                    //             })
                    //         (err.response.status === 401) {
                    //             userSignOut()
                    //             dispatch({
                    //                 type: "ADD_NOTIFICATION",
                    //                 payload: {
                    //                     notification_type: 'ERROR',
                    //                     message: `${err.response.data.message}`
                    //                 }
                    //             })
                    //             history.push({
                    //                 pathname: '/login'
                    //             })
                    //         }
                }
            })
        } catch (error) {
            setError('eventmedia', {
                type: 'server',
                message: 'missing image'
            })
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: `please be sure to add and image`
                }
            })
        }
        
    }

    return (
        <Form onSubmit={handleSubmit(createNewEvent)}>

            <Form.Group controlId='eventname'>
                <Form.Label>Eventname</Form.Label>
                <Form.Control
                    className={errors.eventname ? 'inputError' : ''}
                    {...register('eventname')}
                    autoFocus
                    onFocus={() => clearErrors('eventname')}
                    type='text'
                    name='eventname'
                    required
                />
                <div className='errormessage'>{errors.eventname?.message}</div>
            </Form.Group>

            <Form.Group controlId='eventdate'>
                <Form.Label>Event Date</Form.Label>
                <Form.Control
                    className={errors.eventdate ? 'inputError' : ''}
                    {...register('eventdate')}
                    onFocus={() => clearErrors('eventdate')}
                    type='date'
                    name='eventdate'
                    required
                />
                <div className='errormessage'>{errors.eventdate?.message}</div>
            </Form.Group>
            
            <Form.Group controlId='eventstart'>
                <Form.Label>Start</Form.Label>
                <Form.Control
                    className={errors.eventstart ? 'inputError' : ''}
                    {...register('eventstart', { setValueAs: v => parseInt(v.replace(":", "")) })}
                    onFocus={() => clearErrors('eventstart')}
                    type='time'
                    name='eventstart'
                    required
                />
                <div className='errormessage'>{errors.eventstart?.message}</div>
            </Form.Group>
            
            <Form.Group controlId='eventend'>
                <Form.Label>End</Form.Label>
                <Form.Control
                    className={errors.eventend ? 'inputError' : ''}
                    {...register('eventend', { setValueAs: v => parseInt(v.replace(":", "")) })}
                    onFocus={() => clearErrors('eventend')}
                    type='time'
                    name='eventend'
                    required
                />
                <div className='errormessage'>{errors.eventend?.message}</div>
            </Form.Group>

            {
                editImage &&
                    <Row className='mx-auto'>
                        <canvas
                            id={'eventImagePreview'}
                            ref={canvas}
                            width={384}
                            height={480}
                        />
                    </Row>
            }
            
            <Form.Group controlId='eventmedia'>
                <Form.Label>Event Image</Form.Label>
                <Form.Control
                    className={errors.eventmedia ? 'inputError' : ''}
                    {...register('eventmedia')}
                    onFocus={() => clearErrors('eventmedia')}
                    type='file'
                    name='eventmedia'
                    accept='image/*'
                    onChange={imagePreview}
                />
                <div className='errormessage'>{errors.eventmedia?.message}</div>
            </Form.Group>
            
            <Form.Group controlId='venue_id'>
                <Form.Label>Location</Form.Label>
                <Form.Select
                    className={(errors.venue_id || errors.role_rights) ? 'inputError' : ''}
                    {...register('venue_id')}
                    onFocus={() => clearErrors([ 'venue_id', 'role_rights' ])}
                    type='text'
                    name='venue_id'
                    required
                >
                    <option value='0'>Select...</option>
                    {
                        venue_list.map(venue => (
                            <option key={venue.id} value={venue.id} style={ business_roles.includes(venue.id) ? { color:'green'} : {} }>{venue.business_name}</option>
                        ))
                    }

                </Form.Select>
                <div className='errormessage'>{errors.venue_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>
            </Form.Group>

            <Form.Group controlId='details'>
                <Form.Label>Event Details</Form.Label>
                <Form.Control
                    className={errors.details ? 'inputError' : ''}
                    {...register('details')}
                    autoFocus
                    onFocus={() => clearErrors('details')}
                    as='textarea'
                    row={5}
                    name='details'
                    required
                />
                <div className='errormessage'>{errors.details?.message}</div>
            </Form.Group>

            <Form.Group controlId='brand_id'>
                <Form.Label>Brand</Form.Label>
                <Form.Select
                    className={(errors.brand_id || errors.role_rights) ? 'inputError' : ''}
                    {...register('brand_id')}
                    onFocus={() => clearErrors([ 'brand_id', 'role_rights' ])}
                    type='text'
                    name='brand_id'
                    required
                >
                    <option value='0'>Select...</option>
                    {
                        brand_list.map(brand => (
                            <option key={brand.id} value={brand.id} style={ business_roles.includes(brand.id) ? { color:'green'} : {} }>{brand.business_name}</option>
                        ))
                    }

                </Form.Select>
                <div className='errormessage'>{errors.brand_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>
            </Form.Group>

            <Button type='submit'>Submit</Button>

        </Form>
    )
}

export default withRouter(CreateEvent);