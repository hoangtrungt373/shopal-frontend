import React, {Component} from 'react';
import {Redirect, Route} from "react-router-dom";
import {CustomerRouter} from "../../../config/router";
import {isAuthenticated} from "../../../util/auth.util";

const PrivateRoute = ({component: Component, ...rest}) => {

    return (
        <Route
            {...rest}
            render={props =>
                /* TODO: make authenticate by role too*/
                isAuthenticated() ? (
                    <Component {...rest} {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: CustomerRouter.loginPage,
                            state: {from: props.location}
                        }}
                    />
                )
            }
        />
    )
};

export default PrivateRoute
