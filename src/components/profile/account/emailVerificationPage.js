import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import LoadingSpinner from '../../loadingSpinner';
import AxiosInstance from '../../../helpers/axios';


const EmailVerificationPage = () => {
    const [loading, setLoading] = useState(true)
    const [verifivationError, setVerificationError] = useState('');
    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token')

        if (token) {
            verifyEmailToken(token);
        } else {
            setVerificationError('No verification token found')
            setLoading(false)
        }
    }, [location.search])

    const verifyEmailToken = async (token) => {
        try {
            const response = await AxiosInstance.get(`/users/verify-email?token=${token}`)
            console.log(response)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setVerificationError('failed')
            setLoading(false)
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (verifivationError) {
        return <div>Error: {verifivationError}</div>
    }

    return (
        <div>
            Email SUCCESSFULLY VALIDATED page!
        </div>
    )
}

export default EmailVerificationPage;

