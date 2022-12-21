import React from 'react';
import { useParams } from 'react-router-dom';

import { useEventQuery } from '../../hooks/useEvents';
import LoadingSpinner from '../loadingSpinner';
import EventForm from '../forms/event.form';


const EditEvent = () => {
    const { event_id } = useParams()
    let selected_event

    const { data: event, isLoading, isSuccess } = useEventQuery(event_id)
    
    if(isLoading) {
        <LoadingSpinner />
    }

    if(isSuccess) {
        selected_event = event.data
    }
    
    
    return (
        <EventForm selected_event={selected_event} />   
    )
}

export default EditEvent;