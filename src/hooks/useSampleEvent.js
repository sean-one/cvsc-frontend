import { useEffect, useState } from "react";
import { decode } from "he";
import AxiosInstance from "../helpers/axios";

const useSampleEvent = () => {
    const [ sampleSuccess, setSampleSuccess ] = useState(false)
    const [ sampleEvent, setSampleEvent ] = useState(null)
    const [ sampleLoading, setSampleLoading ] = useState(false)
    const [ sampleError, setSampleError ] = useState(false)

    useEffect(() => {
        const getSampleBusiness = async () => {
            try {

                setSampleLoading(true)
                // check for smokers club business listing
                const cvsc_business = await AxiosInstance.get('/businesses?business_name=Coachella%20Valley%20Smokers%20Club'); 

                // create an date for a sample event, always tomorrow
                const now = new Date();
                let sampleEventDate = new Date(now);
            
                sampleEventDate.setDate(now.getDate() + 2); // Set the date to tomorrow
                sampleEventDate.setUTCHours(0, 0, 0, 0); // Set the time to 00:00.000 in UTC
                sampleEventDate = sampleEventDate.toISOString();
                
                const newSampleEvent = {
                    eventmedia: 'event-media/a219d76310507951d0bed132ce169c6ad5b247d9f2b352b0f324e7c7018bfcd4',
                    active_event: false,
                    event_id: 'sample_event_id', //! not sure what I am going to do here, this will link to a event page
                    eventdate: sampleEventDate,
                    eventstart: 1300,
                    eventend: 1900,
                    host_business: cvsc_business?.data?.id,
                    business_avatar: cvsc_business?.data?.business_avatar,
                    business_name: decode(cvsc_business?.data?.business_name),
                    eventname: 'Upload You Event Now!',
                }

                setSampleEvent(newSampleEvent);
                setSampleSuccess(true)
            } catch (error) {
                setSampleError(true)
            } finally {
                setSampleLoading(false)
            }
        };

        getSampleBusiness();
    }, []);


    return {
        sampleEvent,
        sampleLoading,
        sampleError,
        sampleSuccess,
    };
}

export default useSampleEvent;