import React, {Component} from 'react';
import {Redirect, Route} from "react-router-dom";
import {ACCESS_TOKEN} from "../../../config/constants";
import {CustomerRouter} from "../../../config/router";

const PrivateRoute = ({component: Component, ...rest}) => {

    const authenticated = localStorage.getItem(ACCESS_TOKEN);

    return (
        <Route
            {...rest}
            render={props =>
                authenticated ? (
                    <Component {...rest} {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: CustomerRouter.homePage,
                            state: {from: props.location}
                        }}
                    />
                )
            }
        />
    )
};

export default PrivateRoute
