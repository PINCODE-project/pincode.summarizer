import {ActionIcon, Avatar, Group, Text, UnstyledButton} from '@mantine/core';
import styles from './UserButton.module.css';
import {ConfigService} from "../../services/config.service";
import {IconLogout} from '@tabler/icons-react'
import {localStorageKeys} from "../../core/models/localStorageKeys";
import {useNavigate} from "react-router-dom";

export function UserButton({user}) {
    const navigate = useNavigate();

    return (
        <UnstyledButton className={styles.user}>
            <Group justify="space-between">
                <Group>
                    <Avatar
                        src={`${ConfigService.STATIC}/${user.avatar}`}
                        radius="xl"
                    />

                    <div style={{flex: 1}}>
                        <Text size="sm" fw={500}>
                            {user.secondName} {user.firstName}
                        </Text>

                        <Text c="dimmed" size="xs">
                            {user.login}
                        </Text>
                    </div>
                </Group>
                <ActionIcon
                    variant="subtle"
                    radius="md"
                    color="gray"
                    onClick={() => {
                        localStorage.removeItem(localStorageKeys.accessToken)
                        localStorage.removeItem(localStorageKeys.login)
                        localStorage.removeItem(localStorageKeys.userId)
                        navigate('/login')
                    }}
                >
                    <IconLogout color='#BBBBBB' stroke={1.5}/>
                </ActionIcon>
            </Group>
        </UnstyledButton>
    );
}
