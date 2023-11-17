import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AutoComplete from 'react-google-autocomplete';

import { AddressIcon } from '../icons/siteIcons';

const AddressFormStyles = styled.div`
    .addressInputWrapper {
        margin: 0.25rem 0 0.1rem;
        display: flex;
        align-items: center; 
    }
`

const AddressForm = ({ register, setValue, errors, clearErrors, businessValue=undefined}) => {
    const [inputValue, setInputValue] = useState(businessValue);
    // const [isEditing, setIsEditing] = useState(!!businessValue);
    const [isEditing, setIsEditing] = useState(businessValue === undefined);

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
        if (businessValue) {
            setInputValue(businessValue)
            setIsEditing(false)
        }
    }, [businessValue])

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
                            types: ['address'],
                        }}
                    />
                ) : (
                    <div onClick={handleEditClick}>{inputValue}</div>
                )}
            </div>
            {errors.formatted_address ? <div className='errormessage'>{errors.formatted_address?.message}</div> : null}
            {errors.place_id ? <div className='errormessage'>{errors.place_id?.message}</div> : null}
        </AddressFormStyles>
    )
};

export default AddressForm;