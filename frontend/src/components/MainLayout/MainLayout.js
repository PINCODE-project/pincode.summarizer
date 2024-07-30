import {AppShell, Group, Image} from '@mantine/core';
import {Outlet, useParams} from 'react-router-dom';
import Logo from "../../assets/images/Logo.svg"
import React from "react";
import {UserButton} from "../UserButton/UserButton";
import {useUser} from "../../hooks/useUser";
import styles from "./MainLayout.module.css"
import {RecordPanel} from "../RecordPanel/RecordPanel";

export function MainLayout() {
    const {user, isLoading: isLoadingUser} = useUser()
    const {recordId} = useParams()
    return (
        <AppShell
            header={{height: 70}}
            aside={{width: 500}}
            // navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !openedNavbar}}}
        >
            <AppShell.Header pl='sm' className={styles.navbar}>
                <Group justify="space-between">
                    <Image src={Logo} height={30} w='auto'/>
                    <div>
                        {
                            !isLoadingUser &&
                            <UserButton user={user}/>
                        }
                    </div>
                </Group>
            </AppShell.Header>
            <AppShell.Main>
                <Outlet/>
            </AppShell.Main>
            <AppShell.Aside p="md" className={styles.aside}>
                <RecordPanel recordId={recordId}/>
            </AppShell.Aside>
        </AppShell>
    );
}
