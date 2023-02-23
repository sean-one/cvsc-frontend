import React from "react";
import { takeMonth } from "./getCalendar";
import { format, isBefore,startOfDay } from 'date-fns';


const FullCalendar = () => {
    const today_is = startOfDay(new Date())
    const month_range = takeMonth(today_is)()
    const week_days = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ]

    const nextMonth = () => {
        console.log(month_range[-1])
        console.log('click')
    }


    return (
        <div className='fullCalendar'>
            <div className='d-flex justify-content-between align-items-center'>
                <h2>{format(today_is, 'MMMM')}</h2>
                <div onClick={() => nextMonth()}>next month</div>
            </div>
            <div className='d-flex justify-content-around'>
                {
                    week_days.map(weekday => (
                        <div className='w-100 border border-dark text-center'>{weekday}</div>
                    ))
                }
            </div>
            {
                month_range.map(week => (
                    <div className='d-flex justify-content-around border border-light'>
                        {
                            week.map(month_day => (
                                <div className={`w-100 border border-dark text-start weekDay ps-1 ${(isBefore(month_day, today_is)) && 'daysPast'}`}>
                                    {format(month_day, 'dd')}
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default FullCalendar;