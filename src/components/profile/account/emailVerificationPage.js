import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCannabis } from 'react-icons/fa6';
import { Helmet } from 'react-helmet';

import useNotification from '../../../hooks/useNotification';
import LoadingSpinner from '../../loadingSpinner';
import AxiosInstance from '../../../helpers/axios';

const EmailVerificationPageStyles = styled.div`
    .emailVerificationWrapper {
        display: flex;
        margin: 0 auto;
        max-width: 65rem;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem 1rem;
        text-align: center;
    }

    .emailVerificationHomeButton {
        margin: 2rem auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        cursor: pointer;
    }
`;


const EmailVerificationPage = () => {
    const [loading, setLoading] = useState(true)
    const [verificationError, setVerificationError] = useState(false);
    const { dispatch } = useNotification()
    const location = useLocation()

    let navigate = useNavigate();

    const verifyEmailToken = useCallback(async (token) => {
        try {
            const response = await AxiosInstance.get(`/users/verify-email?token=${token}`)

            if (response?.status === 200) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: response?.data?.message
                    }
                })
            }
            setLoading(false)
        } catch (error) {
            setVerificationError(true)
            setLoading(false)
        }
    }, [dispatch])

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token')

        if (token) {
            verifyEmailToken(token);
        } else {
            setVerificationError(true)
            setLoading(false)
        }
    }, [location.search, verifyEmailToken])

    if (loading) {
        return <LoadingSpinner />
    }


    return (
        <EmailVerificationPageStyles>
            <Helmet>
                <title>CVSC - Email Verification Results</title>
            </Helmet>
            {
                verificationError
                    ? <div className='emailVerificationWrapper'>
                        <div>Verification Email is invalid or has expired.</div>
                        <div>Please login and send a new validation email</div>
                        <div className='buttonLike emailVerificationHomeButton' onClick={() => navigate('/')}><FaCannabis />Calendar</div>
                    </div>
                    : <div className='emailVerificationWrapper'>
                        <div className='headerText'>Email Verified Successfully!</div>
                        <div><span style={{ color: 'var(--main-highlight-color)' }}>Thank you for verifying your email address!</span> Your email has been successfully verified, and you can now enjoy full access to all features of the smokers club.</div>
                        <div className='subheaderText'>Next Steps:</div>
                        <div>
                            <div style={{ color: 'var(--main-highlight-color)' }}>If you have this site open in another tab:</div>
                            <div>Please close this tab and refresh the other one to update your validation status.</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--main-highlight-color)' }}>If this is the only open window for our site:</div>
                            <div>Click the button below to go to the homepage and start exploring.  When you email verification status will update on your next login.</div>
                            <div className='buttonLike emailVerificationHomeButton' onClick={() => navigate('/')}><FaCannabis />Calendar</div>
                        </div>
                    </div>
            }
        </EmailVerificationPageStyles>
    )
}

export default EmailVerificationPage;

