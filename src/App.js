import React, { useEffect, useState } from 'react';
import { startOfToday } from 'date-fns';
import { Route } from 'react-router-dom';

import AxiosInstance from './helpers/axios';

// components
// import { takeMonth, getDaysEvents } from './components/calendar/getCalendar';
import { takeMonth } from './components/calendar/getCalendar';
import Calendar from './components/calendar/calendar';
import EventCard from './components/events/eventCard.jsx';
import Header from './components/header/header.jsx';
import Login from './components/login/login.jsx';
import Profile from './components/profile/profile.jsx';
import AuthRoute from './components/auth/auth.jsx';

import CalendarContext from './context/calendarContext';
import UserContext from './context/userContext';

import './App.css';

const App = () => {
  const [selectedDay, setSelectedDay] = useState(startOfToday());
  const calendarDates = takeMonth(selectedDay)();
  const [ dailyEventList, setDailyEventList ] = useState([]);
  const [ userProfile, setUserProfile ] = useState({})

  const getEventData = async () => {
    const events = await AxiosInstance.get('/events');
    setDailyEventList(events.data);
  }

  useEffect(() => {
    getEventData()
  }, [])

  return (
    <div className="App">
      <Header />
      <CalendarContext.Provider value={{selectedDay, setSelectedDay, calendarDates, dailyEventList, setDailyEventList }}>
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
      <UserContext.Provider value={{userProfile, setUserProfile}}>
        <Route 
          path='/login'
          component={Login}
        />
        <AuthRoute exact path='/profile' component={Profile} />
      </UserContext.Provider>
    </div>
  );
}

export default App;
