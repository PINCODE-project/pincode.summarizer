import React from 'react';
import Logo from '../../../../assets/images/Logo.svg'
import styles from './LoginPage.module.css'
import {LoginForm} from '../../components/LoginForm/LoginForm';
import {Container, Flex, Stack} from "@mantine/core";

export function LoginPage() {
    return (
        <div className={styles.loginPage}>
            <Container size={500} my={40}>
                <Flex
                    gap="xl"
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="nowrap"
                >
                    <img src={Logo} alt='Логотип сервиса' className={styles.logo}/>
                    <LoginForm/>
                </Flex>
            </Container>
        </div>
    )
}
