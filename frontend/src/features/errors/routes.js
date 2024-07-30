import {NotFoundPage} from "./pages/NotFoundPage/NotFoundPage";

export const errorsRoutes = [
    {
        path: '*',
        element: <NotFoundPage/>
    },
]
