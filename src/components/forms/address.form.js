import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import AutoComplete from 'react-google-autocomplete';

import { AddressIcon, RemoveAddressIcon } from '../icons/siteIcons';

const AddressFormStyles = styled.div`
    .addressInputWrapper {
        margin: 0.25rem 0 0.1rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 0.5rem;
    }

    .removeAddress {
        color: var(--error-color);
        text-decoration: line-through;
    }

    .checkboxContainer {
        display: flex;
        align-items: center;
    }

    .checkboxContainer label {
        cursor: pointer;
        display: flex;
    }

    .checkboxContainer input[type='checkbox'] {
        cursor: pointer;
        opacity: 0;
        position: absolute;

        &:checked + label {
            color: var(--error-color);
        }

        &:disabled + label {
            color: gray;
        }
    }
`

const AddressForm = ({ register, setValue, errors, clearErrors, currentValue='', strikethrough=false}) => {
    const [inputValue, setInputValue] = useState(currentValue);
    const [isEditing, setIsEditing] = useState(currentValue === '');
    const [locationBounds, setLocationBounds] = useState(null);

    const { pathname } = useLocation();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleSelect = (place) => {
        setValue('formatted_address', place.formatted_address, { shouldDirty: true });
        setValue('place_id', place.place_id, { shouldDirty: true });
        setInputValue(place.formatted_address);
        clearErrors('formatted_address');
    }

    const handleEditClick = () => {
        setIsEditing(true)
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            const { latitude, longitude } = position.coords;
            const distance = 0.2;
            const southWest = new window.google.maps.LatLng(latitude - distance, longitude - distance);
            const northEast = new window.google.maps.LatLng(latitude + distance, longitude + distance);
            setLocationBounds(new window.google.maps.LatLngBounds(southWest, northEast));
        }, function(error) {
            console.error('Geolocation error: ', error)
        })
    }, [])

    useEffect(() => {
        if (currentValue) {
            setInputValue(currentValue)
            setIsEditing(false)
        }
    }, [currentValue])


    return (
        <AddressFormStyles>
            <div className='addressInputWrapper'>
                <label htmlFor="formatted_address"><AddressIcon /></label>
                {isEditing ? (
                    <AutoComplete
                        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                        {...register('formatted_address')}
                        name='formatted_address'
                        value={inputValue}
                        onChange={handleInputChange}
                        onClick={() => clearErrors('formatted_address')}
                        onPlaceSelected={handleSelect}
                        options={{
                            bounds: locationBounds,
                            types: ['address'],
                        }}
                    />
                ) : (
                    <div onClick={handleEditClick}>
                        <div className={strikethrough ? 'removeAddress' : ''}>{inputValue ? inputValue : 'add address'}</div>
                    </div>
                )}
                {
                    pathname.includes('/business/edit')
                        ? <div className='checkboxContainer'>
                            <input {...register('remove_address')} type='checkbox' id='remove_address' name='remove_address' disabled={currentValue === null} />
                            <label htmlFor='remove_address'><RemoveAddressIcon /></label>
                        </div>
                        : null
                }
            </div>
            {errors.formatted_address ? <div className='errormessage'>{errors.formatted_address?.message}</div> : null}
            {errors.place_id ? <div className='errormessage'>{errors.place_id?.message}</div> : null}
        </AddressFormStyles>
    )
};

export default AddressForm;