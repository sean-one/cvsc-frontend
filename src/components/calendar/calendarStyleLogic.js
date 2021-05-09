import { isEqual, isBefore, startOfToday, isToday } from 'date-fns'

// adjust classNames for the differnt days in the calendar css file
export function dayStyles(day, value) {
    if (isBefore(day, startOfToday())) return "before";
    if (isEqual(day, value)) return "selected";
    if (isToday(day)) return "today";
    return "";
}

// adjust classNames based on the amount of weeks in the month to help with sizing in calendar css file
export function adjustHeight(weeks) {
    if (weeks < 5) return 'fourWeek';
    if (weeks === 5) return 'fiveWeek';
    return 'sixWeek';
}