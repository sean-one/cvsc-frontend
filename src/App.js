import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

// components
import Calendar from './components/calendar/calendar';
import Navbar from './components/navbar';

import Login from './components/login.jsx';
import Register from './components/register.jsx';

import Profile from './components/profile/profile.jsx';
import UserAccount from './components/profile/account/user.account';
import RolesTab from './components/profile/roles/rolesTab';
import UserEventsRelated from './components/profile/events/user.events.related';
import ManagementList from './components/profile/management/management.list';

import EventView from './components/events/views/event.view';
import EventCreateForm from './components/forms/event.create.form';
import EventEditForm from './components/forms/event.edit.form';

import BusinessView from './components/business/businessView';
import BusinessAdminView from './components/business/admin/business.admin.view';
import BusinessCreateForm from './components/forms/business.create.form';
import BusinessEditForm from './components/forms/business.edit.form';

import { ErrorPage } from './components/error/error_404';

import AuthRoute from './components/auth/auth.jsx';
import BusinessManagementAuth from './components/auth/businessManagementAuth';
import PersistLogin from './components/persistLogin';
import ScrollToTop from './components/ScrollToTop';
import { Layout } from './components/Layout';

// import 'bootstrap/dist/css/bootstrap.min.css'

const queryClient = new QueryClient()

const App = () => {


  return (
    <React.Fragment>
      <ScrollToTop/>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Navbar />
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
                    <Route exact path='/profile' element={<UserAccount />} />
                    <Route path='/profile/roles' element={<RolesTab />} />
                    <Route path='/profile/events' element={<UserEventsRelated />} />
                    <Route path='/profile/admin' element={<ManagementList />} />
                </Route>
                <Route path='/event/create' element={<EventCreateForm />} />
                <Route path='/event/edit/:event_id' element={<EventEditForm />} />
                <Route path='/business/create' element={<BusinessCreateForm />} />
                <Route path='/business/admin/:business_id' element={
                    <BusinessManagementAuth>
                        <BusinessAdminView />
                    </BusinessManagementAuth>
                } />
                <Route path='/business/edit/:business_id' element={
                    <BusinessManagementAuth>
                        <BusinessEditForm />
                    </BusinessManagementAuth>
                } />
              </Route>


              {/* catch all for unknown pages */}
              <Route path='/*' element={<ErrorPage />} />
            
            </Route>
          </Routes>
        </Layout>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;
