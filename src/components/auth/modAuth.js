import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';

const ModAuth = ({ children }) => {
    const [ loading, setLoading ] = useState(true);
    const { auth, isLoggedIn } = useAuth();
    const { dispatch } = useNotification();

    let navigate = useNavigate();

    useEffect(() => {
        const mfaVerified = JSON.parse(localStorage.getItem('isMfaVerified'));
        const currentTime = new Date().getTime();

        if (!auth?.user?.is_superadmin) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'invalid user'
                }
            })

            navigate('/profile')
        } else if (!mfaVerified || currentTime > mfaVerified.expiration) {
            localStorage.removeItem('isMfaVerified');
            navigate('/mfa')

        } else {
            setLoading(false)
        }
    }, [auth.user, isLoggedIn, dispatch, navigate]);

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default ModAuth;