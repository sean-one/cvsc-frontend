import React from 'react';
import { Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

// components
import Calendar from './components/calendar/calendar';
import BusinessView from './components/business/businessView';
import { NavHeader } from './components/NavHeader';
import Register from './components/register.jsx';
import Login from './components/login.jsx';
// import AuthRoute from './components/auth/auth.jsx';
import Profile from './components/profile/profile.jsx';
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
          <NavHeader />
          <Layout>
            <Route exact path='/' render={(props) => (<Calendar {...props} />)} />
            <Route path='/register' component={Register} />
            <Route path='/event/:event_id' render={(props) => (<EventView {...props} />)} />
            <Route exact path='/business/:business_id' render={(props) => (<BusinessView {...props} />)} />
            <Route path='/login' component={Login} />
            <Route exact path='/profile' component={Profile} />
            {/* <AuthRoute exact path='/profile' component={Profile} /> */}
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UsersProvider>
    </React.Fragment>
  );
}

export default App;
