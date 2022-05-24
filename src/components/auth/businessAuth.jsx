import { Component } from "react";
// import { Redirect } from "react-router-dom";
import { Route } from "react-router-dom";

const BusinessAuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => <Component {...props} />} />
)

export default BusinessAuthRoute;