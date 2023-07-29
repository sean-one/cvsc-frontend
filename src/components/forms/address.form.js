import React, { useEffect, useState } from 'react';
import AutoComplete from 'react-google-autocomplete';


const AddressForm = ({ register, setValue, errors, clearErrors, defaultValue=null}) => {
    const [ inputValue, setInputValue ] = useState(defaultValue)

    useEffect(() => {
        setValue('formatted_address', inputValue)
    }, [setValue, inputValue])

    const handleSelect = (place) => {
        setValue('formatted_address', place.formatted_address, { shouldDirty: true });
        setValue('place_id', place.place_id, { shouldDirty: true });
        setInputValue(place.formatted_address);
        clearErrors('formatted_address');
    }

    return (
        <div className='standardForm'>
            {
                (defaultValue !== null) &&
                    <div>
                        <div>{`Current address: ${defaultValue}`}</div>
                    </div>
            }
            <div className='inputWrapper'>
                <label htmlFor="formatted_address">Address Search:</label>
                <AutoComplete
                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                    {...register('formatted_address')}
                    name='formatted_address'
                    className='formInput'
                    onClick={() => clearErrors('formatted_address')}
                    onPlaceSelected={handleSelect}
                    options={{
                        types: ['address'],
                    }}
                />
                {errors.formatted_address ? <div className='errormessage'>{errors.formatted_address?.message}</div> : null}
            </div>
        </div>
    )
};

export default AddressForm;