import React from 'react';
import { Route } from 'react-router-dom';

// components
import Calendar from './components/calendar/calendar';
import EventCard from './components/events/eventCard.jsx';
import Business from './components/business/business';
import Header from './components/header/header.jsx';
import Register from './components/register/register.jsx';
import Login from './components/login/login.jsx';
import AuthRoute from './components/auth/auth.jsx';
import Profile from './components/profile/profile.jsx';
import CreateEvent from './components/events/createEvent.jsx';
import EditEvent from './components/events/editEvent';

import SiteProvider from './context/site/site.provider';
import UsersProvider from './context/users/users.provider';
import UserAdminProvider from './context/adminuser/adminuser.provider';

import './App.css';

const App = () => {

  return (
    <div className="App">
      <UsersProvider>
      <SiteProvider>
        <Header />
        <Route path='/register' component={Register} />
        <Route exact path='/' render={(props) => (<Calendar {...props} />)} />
        <Route path='/calendar/:id' render={(props) => (<EventCard {...props} />)} />
        <Route path='/business/:id' render={(props) => (<Business {...props} />)} />
        <AuthRoute path='/events/create' component={CreateEvent} />
        <AuthRoute path='/events/edit/:id' component={EditEvent} />
        <Route path='/login' component={Login} />
        <UserAdminProvider>
          <AuthRoute exact path='/profile' component={Profile} />
        </UserAdminProvider>
      </SiteProvider>
      </UsersProvider>
    </div>
  );
}

export default App;
