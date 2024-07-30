import React from 'react';
import {Outlet} from 'react-router-dom';

export default function NotAuthGuard() {
    // const user = useLogin();
    // const location = useLocation();
    // // const {message} = App.useApp();
    // const [msg, contextHolder] = message.useMessage({content: "Вы уже авторизованы!"});
    //
    // if (user.isAuth) {
    //     const redirect = {
    //         pathname: location.search.slice(1) ?? '/',
    //     };
    //
    //     msg.error({content: "Вы уже авторизованы!", maxCount: 1})
    //
    //     return <>
    //         {contextHolder}
    //         <Navigate to={redirect} replace/>
    //     </>
    // }

    return <Outlet/>;
};
