import React, { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";

import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './loadingSpinner';

const PersistLogin = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const refresh = useRefreshToken()
    const { auth } = useAuth()

    useEffect(() => {
        let isMounted = true

        const verifyRefreshToken = async () => {
            try {
                await refresh()
            }
            catch (err) {
                console.log(err)
            }
            finally {
                isMounted && setIsLoading(false)
            }
        }

        if(Object.keys(auth).length > 0) {
            verifyRefreshToken()
        } else  {
            setIsLoading(false)
        }
        console.log(auth)
        // !auth?.user.accessToken ? verifyRefreshToken() : setIsLoading(false)

        return () => isMounted = false
    }, [auth, refresh])

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <>
            {
                isLoading
                    ? <LoadingSpinner />
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin;