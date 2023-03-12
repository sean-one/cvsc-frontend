import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';


export const FormInput = ({ register, id, onfocus, type, placeholder, error }) => {
    return (
        <div className='inputErrorWrapper'>
            <input
                {...register(id)}
                className={error ? 'inputError' : ''}
                onFocus={onfocus}
                type={type}
                name={id}
                placeholder={placeholder}
            />
            <div className='errormessage'>{error?.message}</div>
        </div>
    )
}

export const CheckBox = ({ register, id, boxlabel }) => {
    return (
        <label htmlFor={id} className='updateCheckbox'>
            <input
                {...register(id)}
                type='checkbox'
                name={id}
            />
            {boxlabel}
        </label>
    )
}

//! not working
export const ImageInput = ({ register, id, onfocus, error, change }) => {
    return (
        <>
            <label htmlFor={id} className='imageUpdateInput'>
                Select Image
                <FontAwesomeIcon icon={faCamera} className='cameraIcon' />
                <input
                    {...register(id)}
                    className={error ? 'inputError' : ''}
                    onFocus={onfocus}
                    type='file'
                    name={id}
                    accept='image/*'
                    onChange={(e) => change(e)}
                />
            </label>
            <div className='errormessage'>{error?.message}</div>
        </>
    )
}

export const BusinessSelect = ({ register, id, onfocus, role_error, business_error, business_list, selectFor }) => {
    return (
        <>
            <select
                className={business_error || role_error ? 'inputError' : ''}
                {...register(id)}
                onFocus={onfocus}
                type='text'
                name={id}
            >
                <option value=''>{selectFor}</option>
                {
                    business_list.map(business => (
                        <option key={business.id} value={business.id}>{business.business_name}</option>
                    ))
                }
            </select>
            <div className='errormessage'>{business_error?.message}</div>
            <div className='errormessage'>{role_error?.message}</div>
        </>
    )
}

export const BusinessTypeSelect = ({register, onfocus, error }) => {
    return (
        <>
            <select
                className={error ? 'inputError' : ''}
                {...register('business_type')}
                onFocus={onfocus}
                type='text'
                name='business_type'
            >
                <option value='brand'>Brand</option>
                <option value='venue'>Dispensary</option>
                <option value='both'>{`Brand & Dispensary`}</option>
            </select>
            <div className='errormessage'>{error?.message}</div>
        </>
    )
}

export const TextAreaInput = ({ register, id, onfocus, error, placeholder }) => {
    return (
        <>
            <textarea
                {...register(id)}
                className={error ? 'inputError' : ''}
                onFocus={onfocus}
                name={id}
                rows='8'
                placeholder={placeholder}
            />
            <div className='errormessage'>{error?.message}</div>
        </>
    )
}