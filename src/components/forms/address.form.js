import React from 'react';
import AutoComplete from 'react-google-autocomplete';


const AddressForm = ({ register, setValue, errors, clearErrors }) => {


    return (
        <div className='standardForm'>
            <div className='inputWrapper'>
                <label htmlFor="address">Address Search:</label>
                <AutoComplete
                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                    {...register('address')}
                    className='formInput'
                    onClick={() => clearErrors('address')}
                    onPlaceSelected={(place) => {
                        if(place && place.formatted_address) {
                            setValue('address', place.place_id)
                        }
                    }}
                    options={{
                        types: ['address'],
                    }}
                />
                {errors.address ? <div className='errormessage'>{errors.address?.message}</div> : null}
            </div>
        </div>
    )
};

export default AddressForm;