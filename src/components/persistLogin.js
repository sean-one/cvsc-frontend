import React, { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";

import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './loadingSpinner';

const PersistLogin = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const refresh = useRefreshToken()
    const { auth, setAuth } = useAuth()


    useEffect(() => {
        let isMounted = true

        const verifyRefreshToken = async () => {
            try {
                await refresh()
            }
            catch (err) {
                setAuth({})
            }
            finally {
                isMounted && setIsLoading(false)
            }
        }

        !auth?.user?.accessToken ? setIsLoading(false) : verifyRefreshToken()
        
        return () => isMounted = false
        // eslint-disable-next-line
    }, [])

    if (isLoading) {
        return <LoadingSpinner />
    }

    
    return (
        <Outlet context={auth}/>
    )
}

export default PersistLogin;