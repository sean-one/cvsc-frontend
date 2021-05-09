import React, { useState } from 'react';
import { startOfToday } from 'date-fns';
import { Route } from 'react-router-dom';

// components
import { takeMonth } from './components/calendar/getCalendar';
import Calendar from './components/calendar/calendar';
import EventCard from './components/events/eventCard.jsx';
import MobileView from './components/mobile/mobileView';

import CalendarContext from './context/calendarContext';

import './App.css';

const App = () => {
  const [selectedDay, setSelectedDay] = useState(startOfToday());
  const calendarDates = takeMonth(selectedDay)();

  return (
    <div className="App">
      <CalendarContext.Provider value={{selectedDay, setSelectedDay, calendarDates}}>
        <Route
          exact
          path='/calendar'
          render={(props) => (
            <Calendar {...props} range={calendarDates} />
          )}
        />
        <Route
          path='/calendar/:id'
          render={(props) => (
            <EventCard {...props} />
          )}
        />
      </CalendarContext.Provider>
      <Route path='/mobile' render={MobileView} />
    </div>
  );
}

export default App;
