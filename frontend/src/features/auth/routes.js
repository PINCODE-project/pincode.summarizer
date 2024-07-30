import React from 'react';
import {LoginPage} from "./pages/LoginPage/LoginPage";
import LandingLayout from "../../components/LandingLayout/LandingLayout";

export const authRoutes = [
    {
        element: <LandingLayout/>,
        children: [
            {
                path: 'login',
                element: <LoginPage/>
            }
        ]
    }
]
