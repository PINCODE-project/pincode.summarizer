import React from 'react';
import {MainLayout} from '../../components/MainLayout/MainLayout';
import {RecordsPage} from './pages/RecordsPage/RecordsPage';

export const recordRoutes = [
    {
        element: <MainLayout/>,
        children: [
            {
                path: ':recordId',
                element: <RecordsPage/>
            },
            {
                path: '',
                element: <RecordsPage/>
            },
        ]
    },
]
