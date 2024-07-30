import React from 'react';
import {Outlet} from 'react-router-dom';
import styles from "./LandingLayout.module.css"

export default function LandingLayout() {
    return (
        <div className={styles.landingLayout}>
            <div className={styles.app}>
                <Outlet/>
            </div>
        </div>
    );
};
