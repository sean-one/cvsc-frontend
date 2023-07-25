import React, { useRef } from 'react';
import AutoComplete from 'react-google-autocomplete';


const AddressForm = ({ register, setValue, errors, clearErrors, defaultValue=null, place_id=null}) => {
    const inputValue = useRef(defaultValue)


    return (
        <div className='standardForm'>
            <div className='inputWrapper'>
                <label htmlFor="place_id">{(defaultValue !== null) ? 'Current Address:' : 'Address Search:'}</label>
                <AutoComplete
                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                    {...register('place_id')}
                    name='place_id'
                    onBlur={(e) => {
                        console.log('left the input')
                        if(e.target.value === '') {
                            setValue('place_id', place_id)
                            console.log('empty string')
                        }
                        console.log(e.target.value)
                    }}
                    className='formInput'
                    onClick={() => clearErrors('place_id')}
                    ref={inputValue}
                    onPlaceSelected={(place, inputRef) => {
                        if(place && place.formatted_address) {
                            setValue('place_id', place.place_id)
                            setValue('formatted_address', place.formatted_address)
                        }
                    }}
                    // placeholder={(defaultValue !== null) ? `${defaultValue}` : 'Enter a location'}
                    options={{
                        types: ['address'],
                    }}
                />
                {errors.place_id ? <div className='errormessage'>{errors.place_id?.message}</div> : null}
            </div>
        </div>
    )
};

export default AddressForm;