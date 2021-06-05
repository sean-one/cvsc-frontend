import { Redirect } from "react-router";
import { Route } from 'react-router-dom';

import checkToken from './checkToken';

const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        checkToken() ? (
            <Component {...props} />    
        ) : (
            <Redirect to={{ pathname: '/login' }} />
        )
    )} />
)

export default AuthRoute;