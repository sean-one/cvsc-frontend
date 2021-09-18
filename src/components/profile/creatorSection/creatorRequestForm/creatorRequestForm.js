import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { requestBusinessCreator } from '../../../../helpers/validationSchemas';

import { EventsContext } from '../../../../context/events/events.provider';

import '../creatorSection.css'

const CreatorRequestForm = (props) => {
    const { businessList } = useContext(EventsContext)
    const { register, handleSubmit, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(requestBusinessCreator)
    });

    const sendRequest = (data) => {
        console.log(data)
    }

    return (
        <div className='requestCreator'>
            <p>Request Business Creator Rights</p>
            <div className='requestFormWrapper'>
                <form onSubmit={handleSubmit(sendRequest)}>
                    <label htmlFor='business_id'>business</label>
                    <select id='business_id' {...register('business_id', { valueAsNumber: true })} required >
                        <option value='0'>Select...</option>
                        {
                            businessList.map(business => (
                                <option key={business.id} value={business.id}>{business.name}</option>
                            ))
                        }
                    </select>
                    <p className='errormessage'>{errors.business_id?.message}</p>
                    <div className='radioBox'>

                        <input {...register('user_rights', { required: true })} type="radio" id="creator_rights" value="creator" />
                        <label htmlFor='creator_rights' >creator</label>
                        
                        <input {...register('user_rights', { required: true })} type="radio" id="admin_rights" value="admin" />
                        <label htmlFor='admin_rights' >admin</label>
                    
                    </div>
                    <input type='submit' value='submit' />
                </form>
            </div>
        </div>
    )
}

export default CreatorRequestForm;