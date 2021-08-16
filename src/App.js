import React from 'react';
import { Route } from 'react-router-dom';

// components
import Calendar from './components/calendar/calendar';
import EventCard from './components/events/eventCard.jsx';
import Header from './components/header/header.jsx';
import Register from './components/register/register.jsx';
import Login from './components/login/login.jsx';
import AuthRoute from './components/auth/auth.jsx';
import Profile from './components/profile/profile.jsx';
import CreateEvent from './components/events/createEvent.jsx';
import EditEvent from './components/events/editEvent';

import EventsProvider from './context/events/events.provider';
import UsersProvider from './context/users/users.provider';

import './App.css';

const App = () => {

  return (
    <div className="App">
      <EventsProvider>
      <UsersProvider>
        <Header />
        <Route path='/register' component={Register} />
        <Route exact path='/' render={(props) => (<Calendar {...props} />)} />
        <Route path='/calendar/:id' render={(props) => (<EventCard {...props} />)} />
        <AuthRoute path='/events/create' component={CreateEvent} />
        <AuthRoute path='/events/edit/:id' component={EditEvent} />
        <Route path='/login' component={Login} />
        <AuthRoute exact path='/profile' component={Profile} />
      </UsersProvider>
      </EventsProvider>
    </div>
  );
}

export default App;
