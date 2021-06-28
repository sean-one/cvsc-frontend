import React from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import formatTime from '../../helpers/formatTime';

import './adminEventPreview.css'

const AdminEventPreview = (props) => {

    return (
        <div className='eventLine'>
            <div className='eventtitleandcontrols'>
                <h3>{props.event.eventname}</h3>
                <div className='adminControls'>
                    <span>
                        <FontAwesomeIcon icon={faPencilAlt} size='lg' />
                    </span>
                    <span>
                        <FontAwesomeIcon id={props.event.event_id} className='trashcan' icon={faTrashAlt} size='lg' onClick={props.delEvent} />
                    </span>
                </div>
            </div>
            <div className='eventDetails'>
                <p>{format(new Date(props.event.eventdate), 'MMM d, y')}</p>
                <p>{`${formatTime(props.event.eventstart)} - ${formatTime(props.event.eventend)}`}</p>
            </div>
            <div className='location'>
                <p>{props.event.venue_name}</p>
            </div>
        </div>
    )
}

export default AdminEventPreview;