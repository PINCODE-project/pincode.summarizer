import React from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth";

export default function AuthGuard() {
    const user = useAuth();
    const location = useLocation();

    if (!user.isAuth) {
        const redirect = {
            pathname: 'login',
            search: location.pathname,
        };
        return <Navigate to={redirect} replace />;
    }

    return <Outlet/>;
};
