import React from 'react';
import MainLayout from "../../components/MainLayout/MainLayout";
import {HomePage} from "./pages/HomePage/HomePage";

export const homeRoutes = [
    {
        element: <MainLayout/>,
        children: [
            {
                path: 'home',
                element: <HomePage/>
            },
        ]
    },
]
