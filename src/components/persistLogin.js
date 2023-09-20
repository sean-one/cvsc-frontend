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
                console.log('inside catch')
                console.log(err)
                setAuth({})
            }
            finally {
                isMounted && setIsLoading(false)
            }
        }

        !auth?.user?.accessToken ? verifyRefreshToken() : setIsLoading(false)
        
        return () => isMounted = false
        // eslint-disable-next-line
    }, [])

    if (isLoading) {
        return <LoadingSpinner />
    }

    
    return (
        <Outlet />
    )
}

export default PersistLogin;