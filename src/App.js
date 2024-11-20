import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
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
import ModUsers from './components/auth/mod/mod_users';
import ModBusinesses from './components/auth/mod/mod_businesses';
import ModEvents from './components/auth/mod/mod_events';
import ModLogs from './components/auth/mod/mod_logs.js';
import ForgotPassword from './components/forgotPassword.js';
import ResetPassword from './components/resetPassword.js';
import MFASetUp from './components/auth/mod/mfa_setup.js';
import PrivacyPolicy from './components/legal/privacyPolicy.js';
import TOS from './components/legal/tos.js';
import ContactUs from './components/contactUs.js';

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
      <Helmet>
        <title>Coachella Valley Smokers Club</title>
        <meta name="description" content="Explore and connect with the cannabis community in Coachella Valley. Join events, share experiences, and stay updated with local cannabis related news." />
        <meta name="keywords" content="coachella valley, cannabis, community, cannabis events" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Coachella Valley Smokers Club" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://coachellavalleysmokersclub.com" />
        <meta property="og:image" content="https://coachellavalleysmokersclub.com/assets/meta_og_image.webp" />
        <meta property="og:description" content="Explore and connect with the cannabis community in Coachella Valley. Join events, share experiences, and stay updated with local cannabis related news." />

      </Helmet>
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
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />
              <Route path='/register' element={<Register />} />
              <Route path='/event/:event_id' element={<EventView />} />
              <Route exact path='/business/:business_id' element={<BusinessView />} />
              <Route path='/email-verified' element={<EmailVerificationPage />} />
              <Route path='/cvsc-privacypolicy' element={<PrivacyPolicy />} />
              <Route path='/cvsc-tos' element={<TOS />} />
              <Route path='/contact-us' element={<ContactUs />} />
              
              {/* private routes */}
              <Route element={<AuthRoute />}>
                <Route path='/profile' element={<Profile />}>
                    <Route exact path='/profile' element={<UserAccount />} />
                    <Route path='/profile/roles' element={<RolesTab />} />
                    <Route path='/profile/events' element={<UserEventsRelated />} />
                    <Route path='/profile/admin' element={<ManagementList />} />
                </Route>
                <Route path='/mfa' element={<MFASetUp />} />
                <Route path='/squirrelmaster/*' element={
                  <ModAuth>
                    <Routes>
                      <Route path='/' element={<SquirrelMaster />} />
                      <Route path='users' element={<ModUsers />} />
                      <Route path='businesses' element={<ModBusinesses />} />
                      <Route path='events' element={<ModEvents />} />
                      <Route path='logs' element={<ModLogs />} />
                    </Routes>
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
