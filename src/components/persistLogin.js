import React, { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";

import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './loadingSpinner';

const PersistLogin = () => {
    console.log('inside persist')
    const [ isLoading, setIsLoading ] = useState(true)
    const refresh = useRefreshToken()
    const { auth, persist } = useAuth()

    console.log(auth)
    useEffect(() => {
        let isMounted = true

        const verifyRefreshToken = async () => {
            try {
                console.log('sending to refresh')
                await refresh()
            }
            catch (err) {
                console.log(err)
            }
            finally {
                isMounted && setIsLoading(false)
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)

        return () => isMounted = false
    }, [])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <LoadingSpinner />
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin;