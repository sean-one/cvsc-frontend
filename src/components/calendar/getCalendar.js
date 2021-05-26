import {
    format,
    startOfMonth,
    startOfWeek,
    endOfMonth,
    endOfWeek,
    startOfDay,
    addDays
} from 'date-fns';

// generator function to create an array of days into a week
export function takeWeek(start = new Date()) {
    let date = startOfWeek(startOfDay(start));

    return function () {
        const week = [...Array(7)].map((_, i) => addDays(date, i));
        date = addDays(week[6], 1);
        return week;
    };
}

// generator function to create an array of weeks into a month array
export function takeMonth(start = new Date()) {
    let month = []
    let date = start;

    // find the last day in a range of days
    function getLastDay(range) {
        return range[range.length - 1][6];
    }

    return function () {
        const weekGenerator = takeWeek(startOfMonth(date));
        const endDate = startOfDay(endOfWeek(endOfMonth(date)));
        month.push(weekGenerator());

        while (getLastDay(month) < endDate) {
            month.push(weekGenerator());
        }

        const range = month;
        month = []
        date = addDays(getLastDay(range), 1);

        return range;
    };
}

// get the events for each specific day
export function sortDaysEvents(events, filter = null) {
    if (filter) {
        events = events.filter(event => event.brand_id === filter)
        // console.log(`passed a filter: ${filter}`)
    }
    return events.reduce((obj, event) => {
        let eventDate = new Date(event.eventdate);
        // get the day of the event
        eventDate = format(startOfDay(eventDate), 'PP');

        // check to see if that day has any other events
        if(!obj.hasOwnProperty(eventDate)) {
            // create days event
            obj[eventDate] = []
        }

        // add the event to that specific day
        obj[eventDate].push(event);

        return obj;
    }, {});
    // console.log(events)
    // return a new list of events sorted by day
    // console.log(calendarDay)
    // return fakeEvents.filter(event => isEqual(startOfDay(event.eventStart), calendarDay))
}