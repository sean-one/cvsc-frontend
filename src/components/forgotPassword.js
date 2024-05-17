import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import AxiosInstance from '../helpers/axios';
import useNotification from '../hooks/useNotification';
import { emailformat } from './forms/utils/form.validations';

const ForgotPasswordStyles = styled.div`
    .forgotPasswordWrapper {
        padding: 2rem 1rem;
        /* background: red; */
    }

    .forgotPasswordInfo {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    #forgotPasswordButton {
        margin: 1rem auto;
        max-width: 20rem;
    }
`;

const ForgotPassword = () => {
    const { dispatch } = useNotification();

    const { register, handleSubmit, clearErrors, reset, formState: { errors } } = useForm({
        mode: "onBlur",
        defaultValues: {
            useremail: ''
        }
    })

    const sendResetLink = async (data) => {
        try {
            const response = await AxiosInstance.post(`/users/forgot-password`, { useremail: data.useremail });

            if (response.status === 200) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: response?.data?.message
                    }
                })
    
                reset()
            }
        } catch (error) {
            console.error(`Error sending reset link:`, error)
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })
        }
    }

    return (
        <ForgotPasswordStyles>
            <div className='forgotPasswordWrapper'>
                <div className='forgotPasswordInfo subheaderText'>Provide your registered email to receive a password reset link.</div>
                <form className='standardForm' onSubmit={handleSubmit(sendResetLink)}>
                    
                    <div className='inputWrapper'>
                        <input {...register('useremail', {
                            required: 'valid email is required',
                            pattern: {
                                value: emailformat,
                                message: 'invalid email format'
                            }
                        })} type='email' onChange={() => clearErrors('useremail')} placeholder='Enter valid email address' autoComplete='off' />
                        {errors.useremail ? <div className='errormessage'>{errors.useremail?.message}</div> : null}
                    </div>

                    <button id='forgotPasswordButton' type='submit'>Send Reset Link</button>
                </form>
            </div>
        </ForgotPasswordStyles>
    );
};

export default ForgotPassword;