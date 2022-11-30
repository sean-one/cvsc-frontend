import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

// components
import Calendar from './components/calendar/calendar';
import BusinessView from './components/business/businessView';
import Navbar from './components/navbar';
import Register from './components/register.jsx';
import Login from './components/login.jsx';
import AuthRoute from './components/auth/auth.jsx';
import PersistLogin from './components/persistLogin';
import Profile from './components/profile/profile.jsx';
import RolesTab from './components/profile/rolesTab/rolesTab';
import UserEventsTab from './components/profile/userEventsTab/userEventsTab';
import BusinessList from './components/profile/managerTab/businessList';
import CreateEvent from './components/events/createEvent';
import CreateBusiness from './components/business/businessForms/createBusiness';
import EventView from './components/events/eventView';

import ScrollToTop from './components/ScrollToTop';
import { Layout } from './components/Layout';

import UsersProvider from './context/users/users.provider';

import 'bootstrap/dist/css/bootstrap.min.css'

const queryClient = new QueryClient()

const App = () => {

  
  return (
    <React.Fragment>
      <ScrollToTop/>
      <UsersProvider>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Layout>
            <Routes>
              <Route element={<PersistLogin />}>
                {/* public routes */}
                <Route exact path='/' element={<Calendar />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/event/:event_id' element={<EventView />} />
                <Route exact path='/business/:business_id' element={<BusinessView />} />
                {/* private routes */}
                <Route element={<AuthRoute />}>
                  <Route path='/profile' element={<Profile />}>
                      <Route path='/profile/roles' element={<RolesTab />} />
                      {/* <Route path='/profile/roles/:user_id' element={<RolesTab />} /> */}
                      <Route path='/profile/events' element={<UserEventsTab />} />
                      <Route path='/profile/management' element={<BusinessList />} />
                  </Route>
                  <Route path='/events/new' element={<CreateEvent />} />
                  <Route path='/businesses/new' element={<CreateBusiness />} />
                </Route>
              </Route>
            </Routes>
            {/* <Route exact path='/' render={(props) => (<Calendar {...props} />)} /> */}
            {/* <AuthRoute exact path='/profile' component={Profile} /> */}
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UsersProvider>
    </React.Fragment>
  );
}

export default App;
