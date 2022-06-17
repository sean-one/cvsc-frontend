import { useState, useEffect, useCallback } from "react";
import AxiosInstance from "../helpers/axios";


const useSiteFetch = () => {
    const [ data, setData ] = useState({})
    const [ loading, setLoading ] = useState(true)
    const [ fetchError, setFetchError ] = useState(null)
    
    const getSiteData = useCallback(async (isMounted) => {
        try {
            const eventCall = await AxiosInstance.get('/events')
            const businessCall = await AxiosInstance.get('/business')

            if (isMounted) {
                setData({ events: eventCall.data, businessList: businessCall.data })
                setFetchError(null)
            }

        } catch (error) {
            if (error.status === 400) {
                if (isMounted) {
                    setFetchError(error.message)
                    setData([])
                }
            } else if (error.response.status === 404) {
                if (isMounted) {
                    setFetchError(`${error.response.config.url} response error`)
                    setData([])
                }
            } else {
                if (isMounted) {
                    setFetchError(error)
                    setData([])
                }
            } 
             
        } finally {
            setLoading(false)
        }
    }, [])


    useEffect(() => {
        setLoading(true)
        let isMounted = true
        
        getSiteData(isMounted)
        
        return () => {
            isMounted = false;
        }
    }, [getSiteData])
    
    return { data, loading, fetchError };
}

export default useSiteFetch;


