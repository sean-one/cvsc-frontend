import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';

const ModAuth = ({ children }) => {
    const { auth } = useAuth();
    const { dispatch } = useNotification();

    let navigate = useNavigate();

    useEffect(() => {

        if (!auth?.user?.is_superadmin) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'not superadmin'
                }
            })

            navigate('/')
        }

    }, [auth.user, dispatch, navigate]);

    return (
        <div>
            <h1>ModAuth Component</h1>
            {children}
        </div>
    )
}

export default ModAuth;