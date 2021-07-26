
export const formatTime = (eventtime) => {
    if (eventtime > 1200) {
        eventtime = eventtime - 1200;
        eventtime = eventtime.toString().concat('p')
    } else if (eventtime > 1200 && eventtime < 1260) {
        eventtime = eventtime.toString().concat('p')
    } else {
        eventtime = eventtime.toString().concat('a')
    }
    eventtime = eventtime.slice(0, -3) + ':' + eventtime.slice(-3)
    return eventtime
}

export const reformatTime = (eventtime) => {
    eventtime = eventtime.toString()
    eventtime = eventtime.slice(0, -2) + ':' + eventtime.slice(-2)
    if (eventtime.length === 4) {
        eventtime = `0${eventtime}`;
    }
    return eventtime;
}