import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { decode } from 'he';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import PasswordInputToggle from './forms/password.input.view.toggle';

import AxiosInstance from '../helpers/axios';
import useNotification from '../hooks/useNotification';

const ResetPasswordStyles = styled.div`
    .resetPasswordWrapper {
        max-width: var(--max-section-width);
        margin: 0 auto;
    }

    .passwordDetails {
        text-align: center;
        padding: 0.5rem 1rem;
    }

    .resetPasswordForm {
        margin-top: 2rem;
    }

    #resetPasswordButton {
        margin: 1.5rem 1rem 1rem auto;
        max-width: 18rem;
    }
`;

const ResetPassword = () => {
    const location = useLocation();
    let navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const { dispatch } = useNotification();

    const { control, clearErrors, handleSubmit, setError, formState: { errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            password: '',
            confirmation: ''
        }
    });

    const updatePassword = async (data) => {
        if (!data.password || !data.confirmation) {
            setError('credentials', { message: 'all inputs are required'})
        }

        if (data.password !== data.confirmation) {
            setError('credentials', { message: 'password and confirmation must match'})
        }

        try {
            const response = await AxiosInstance.post(`/users/reset-password?token=${token}`, { password: data.password })

            if (response?.status === 201) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: response?.data?.message,
                    }
                });
    
                navigate('/login', { state: { username: decode(response?.data?.username) }})
            }

        } catch (error) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message,
                }
            });
        }
    }

    return (
        <ResetPasswordStyles>
            <Helmet>
                <title>CVSC - Password Reset</title>
            </Helmet>
            <div className='resetPasswordWrapper'>
                <div className='passwordDetails subheaderText'>Reset Password</div>
                <div className='passwordDetails'>Please enter your <span style={{ color: 'var(--main-highlight-color)' }}>new password</span> below.  Make sure your password is <span style={{ color: 'var(--main-highlight-color)' }}>strong and secure</span></div>
                <div className='passwordDetails'>After you enter and confirm your new password, click the <span style={{ color: 'var(--main-highlight-color)' }}>"update password"</span> button to update your password.</div>
                <form onSubmit={handleSubmit(updatePassword)} className='standardForm resetPasswordForm'>

                    <PasswordInputToggle
                        control={control}
                        inputName='password'
                        errors={errors}
                        clearErrors={clearErrors}
                    />

                    <PasswordInputToggle
                        control={control}
                        inputName='confirmation'
                        errors={errors}
                        clearErrors={clearErrors}
                    />

                    { errors.credentials ? <div className='errormessage'>{errors.credentials?.message}</div> : null}

                    <button className='buttonLike' id='resetPasswordButton' type='submit'>update password</button>
                </form>
            </div>
        </ResetPasswordStyles>
    )
}

export default ResetPassword;