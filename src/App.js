import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
import EmailVerificationPage from './components/profile/account/emailVerificationPage.js';

import EventView from './components/events/views/event.view';
import EventCreateForm from './components/forms/event.create.form';
import EventEditForm from './components/forms/event.edit.form';

import BusinessesView from './components/business/businesses.view.js';
import BusinessView from './components/business/businessView';
import BusinessAdminView from './components/business/admin/business.admin.view';
import BusinessCreateForm from './components/forms/business.create.form';
import BusinessEditForm from './components/forms/business.edit.form';

import { ErrorPage } from './components/error/error_404';

import AuthRoute from './components/auth/auth.jsx';
import BusinessManagementAuth from './components/auth/businessManagementAuth';
import ModAuth from './components/auth/modAuth.js';
import PersistLogin from './components/persistLogin';
import ScrollToTop from './components/ScrollToTop';
import { Layout } from './components/Layout';
import SquirrelMaster from './components/auth/mod/squirrel_master.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        // statuses for which no retry is needed
        const noRetryStatuses = [400, 401, 403, 404];
        // access the error status is exists
        const status = error?.response?.status;
        // do not retry if status is in noRetry
        return !noRetryStatuses.includes(status) && failureCount < 3;
      }
    }
  }
})


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
              <Route path='/businesses' element={<BusinessesView />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/event/:event_id' element={<EventView />} />
              <Route exact path='/business/:business_id' element={<BusinessView />} />
              <Route path='/email-verified' element={<EmailVerificationPage />} />
              
              {/* private routes */}
              <Route element={<AuthRoute />}>
                <Route path='/profile' element={<Profile />}>
                    <Route exact path='/profile' element={<UserAccount />} />
                    <Route path='/profile/roles' element={<RolesTab />} />
                    <Route path='/profile/events' element={<UserEventsRelated />} />
                    <Route path='/profile/admin' element={<ManagementList />} />
                </Route>
                <Route path='/squirrelmaster' element={
                  <ModAuth>
                    <SquirrelMaster />
                  </ModAuth>
                }/>
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
              <Route path='/404' element={<ErrorPage />} />
              <Route path='/*' element={<ErrorPage />} />
            
            </Route>
          </Routes>
        </Layout>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;
