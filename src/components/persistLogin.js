import React, { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";

import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './loadingSpinner';


const PersistLogin = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const refresh = useRefreshToken()
    const { auth, isLoggedIn, setAuth } = useAuth()

    useEffect(() => {
        let isMounted = true

        const verifyRefreshToken = async () => {
            try {
                await refresh()
            }
            catch (err) {
                setAuth(null)
            }
            finally {
                isMounted && setIsLoading(false)
            }
        }

        if (isLoggedIn && !auth?.user?.accessToken) {
            verifyRefreshToken()
        } else {
            setIsLoading(false)
        }
        
        return () => isMounted = false
        // eslint-disable-next-line
    }, [isLoggedIn, auth])

    if (isLoading) {
        return <LoadingSpinner />
    }

    
    return (
        <Outlet />
    )
}

export default PersistLogin;