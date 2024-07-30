import {BrowserRouter} from 'react-router-dom';
import {createTheme, MantineProvider, Paper} from '@mantine/core';
import {RootRouter} from './routes/RootRouter';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Notifications} from "@mantine/notifications";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'swagger-ui-react/swagger-ui.css'
import './App.css';
import './swagger.css';
import './themes/variables.css'

export default function MyApp() {
    const queryClient = new QueryClient()

    const theme = createTheme({
        fontFamily: 'SFPro, serif',
    });

    return (
        <div className='App'>
            <QueryClientProvider client={queryClient}>
                <MantineProvider defaultColorScheme='dark' theme={theme}>
                    <BrowserRouter>
                        <RootRouter/>
                        <Notifications/>
                        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
                    </BrowserRouter>
                </MantineProvider>
            </QueryClientProvider>
        </div>
    );
}
