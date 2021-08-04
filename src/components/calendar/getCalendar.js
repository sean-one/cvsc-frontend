import {
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