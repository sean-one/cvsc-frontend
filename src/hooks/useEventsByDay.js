import { format, startOfDay } from 'date-fns';

// takes in an array of events and return an object of events sorted by each day
const useEventsByDay = (eventlist) => {
    if(eventlist === undefined) return {}
    return eventlist.reduce((obj, event) => {
        let eventDate = new Date(event.eventdate);
        // get the day of the event
        eventDate = format(startOfDay(eventDate), 'PP');

        // check to see if that day has any other events
        if (!obj.hasOwnProperty(eventDate)) {
            // create days event
            obj[eventDate] = []
        }

        // add the event to that specific day
        obj[eventDate].push(event);

        return obj;
    }, {});
}

export default useEventsByDay;