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
import Register from './components/register/register.jsx';
import Login from './components/login/login.jsx';
import AuthRoute from './components/auth/auth.jsx';
import Profile from './components/profile/profile.jsx';
import CreateEvent from './components/events/createEvent.jsx';
import EditEvent from './components/events/editEvent';

import CalendarContext from './context/calendarContext';
import UserContext from './context/userContext';

import './App.css';

const App = () => {
  const [selectedDay, setSelectedDay] = useState(startOfToday());
  const calendarDates = takeMonth(selectedDay)();
  const [ dailyEventList, setDailyEventList ] = useState([]);
  const [ userProfile, setUserProfile ] = useState({})
  const [ userEvents, setUserEvents ] = useState([])

  useEffect(() => {
    AxiosInstance.get('/events')
      .then(events => setDailyEventList(events.data));
  }, [userEvents])

  // console.log(dailyEventList)
  return (
    <div className="App">
      <UserContext.Provider value={{userProfile, setUserProfile, userEvents, setUserEvents}}>
      <Header />
      <CalendarContext.Provider value={{selectedDay, setSelectedDay, calendarDates, dailyEventList, setDailyEventList }}>
        <Route
          exact
          path='/'
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
        <Route 
          path='/login'
          component={Login}
        />
        <Route
          path='/register'
          component={Register}
        />
        <AuthRoute exact path='/profile' component={Profile} />
        <AuthRoute path='/events/create' component={CreateEvent} />
        <AuthRoute path='/events/edit/:id' component={EditEvent} />
      </UserContext.Provider>
    </div>
  );
}

export default App;
