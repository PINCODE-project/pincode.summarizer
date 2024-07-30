import {Button, Container, Group, Text, Title} from '@mantine/core';
import NotFound from '../../../../assets/images/NotFound.svg';
import styles from './NotFoundPage.module.css';
import {useNavigate} from "react-router-dom";

export function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <Container className={styles.root}>
            <div className={styles.inner}>
                <img src={NotFound} alt='Not Found' className={styles.image}/>
                <div className={styles.content}>
                    <Title className={styles.title}>Страница не найдена</Title>
                    <Group justify="center">
                        <Text c="dimmed" size="lg" ta="center" className={styles.description}>
                            Страница, которую вы пытаетесь открыть, не существует. Возможно, вы неправильно ввели адрес или
                            страница была перемещена на другой URL. Если вы считаете, что это ошибка, обратитесь в службу поддержки.
                        </Text>
                    </Group>
                    <Group justify="center">
                        <Button size="md" onClick={() => navigate('/')}>Вернуться на главную</Button>
                    </Group>
                </div>
            </div>
        </Container>
    );
}
