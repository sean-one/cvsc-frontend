import React, { useContext } from 'react'
import { format } from 'date-fns';
import { Link, withRouter } from 'react-router-dom';

import {dayStyles} from './calendarStyleLogic';

import './day.css';
import CalendarContext from '../../context/calendarContext';

const Day = (props) => {
    const { selectedDay, setSelectedDay } = useContext(CalendarContext);
    const daysEvents = props.schedule

    // console.log(props)

    return (
        <>
            <div className={`days ${dayStyles(props.day, selectedDay)}`} onClick={() => setSelectedDay(props.day)} >
                <p className='date-digit'>{format(props.day, 'd')}</p>
                {daysEvents.length > 0 ?
                    daysEvents.map(event => (
                            <div key={event['id']}>
                                <Link to={{
                                    pathname: `calendar/${event.id}`,
                                    state: {
                                        event,
                                        from: props.location.pathname
                                    }
                                }}>
                                    <p>{event.eventName}</p>
                                </Link>
                            </div>
                    )) :
                    null
                    }
            </div>
        </>
    )
}

export default withRouter(Day);
