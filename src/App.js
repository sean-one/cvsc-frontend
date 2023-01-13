import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools'

// components
import Calendar from './components/calendar/calendar';
import Navbar from './components/navbar';

import Login from './components/login.jsx';
import Register from './components/register.jsx';
import BusinessRoles from './components/roles/business.roles';

import Profile from './components/profile/profile.jsx';
import UserEditForm from './components/profile/forms/user.edit.form';
import RolesTab from './components/profile/roles';
import UserEvents from './components/profile/events/user.events';
import ManagementList from './components/profile/management/management.list';

import EventView from './components/events/views/event.view';
import EventCreateForm from './components/events/forms/event.create.form';
import EventEditForm from './components/events/forms/event.edit.form';

import BusinessView from './components/business/businessView';
import BusinessCreateForm from './components/business/forms/business.create.form';
import UpdateBusiness from './components/business/update.business';

import { ErrorPage } from './components/error/error_404';

import AuthRoute from './components/auth/auth.jsx';
import PersistLogin from './components/persistLogin';
import ScrollToTop from './components/ScrollToTop';
import { Layout } from './components/Layout';

import 'bootstrap/dist/css/bootstrap.min.css'

const queryClient = new QueryClient()

const App = () => {

  
  return (
    <React.Fragment>
      <ScrollToTop/>
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
                    <Route path='/profile/events' element={<UserEvents />} />
                    <Route path='/profile/management' element={<ManagementList />} />
                    <Route path='/profile/edit' element={<UserEditForm />} />
                </Route>
                <Route path='/event/create' element={<EventCreateForm />} />
                <Route path='/event/edit/:event_id' element={<EventEditForm />} />
                <Route path='/business/create' element={<BusinessCreateForm />} />
                <Route path='/business/edit/:business_id' element={<UpdateBusiness />} />
                <Route path='/business/roles/:business_id' element={<BusinessRoles />} />
              </Route>
              {/* catch all for unknown pages */}
              <Route path='/*' element={<ErrorPage />} />
            </Route>
          </Routes>
          {/* <Route exact path='/' render={(props) => (<Calendar {...props} />)} /> */}
          {/* <AuthRoute exact path='/profile' component={Profile} /> */}
        </Layout>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;
