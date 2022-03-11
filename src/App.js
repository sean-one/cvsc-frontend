import React from 'react';
import { Route } from 'react-router-dom';

// components
import Calendar from './components/calendar/calendar';
import Business from './components/business/business';
import { NavHeader } from './components/NavHeader';
import Register from './components/register.jsx';
import Login from './components/login.jsx';
import AuthRoute from './components/auth/auth.jsx';
import Profile from './components/profile/profile.jsx';
import EventView from './components/events/eventView';
import EditBusiness from './components/business/editBusiness';
import EditEvent from './components/events/editEvent';

import { Layout } from './components/Layout';

import SiteProvider from './context/site/site.provider';
import UsersProvider from './context/users/users.provider';
import RolesProvider from './context/roles/roles.provider';
import UserAdminProvider from './context/adminuser/adminuser.provider';

// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {

  return (
    <React.Fragment>
      <UsersProvider>
      <SiteProvider>
          <RolesProvider>
            <NavHeader />
          </RolesProvider>
          <Layout>
            <Route exact path='/' render={(props) => (<Calendar {...props} />)} />
            <Route path='/register' component={Register} />
            <Route path='/event/:id' render={(props) => (<EventView {...props} />)} />
            <Route exact path='/business/:id' render={(props) => (<Business {...props} />)} />
            <AuthRoute path='/business/edit/:id' component={EditBusiness} />
            <AuthRoute path='/events/edit/:id' component={EditEvent} />
            <Route path='/login' component={Login} />
            <RolesProvider>
              <UserAdminProvider>
                <AuthRoute exact path='/profile' component={Profile} />
              </UserAdminProvider>
            </RolesProvider>
          </Layout>
      </SiteProvider>
      </UsersProvider>
    </React.Fragment>
  );
}

export default App;
