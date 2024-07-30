import styles from "./HomePage.module.css"
import {useProfile} from "../../../../hooks/use-profile";
import {useEffect} from "react";
import {getUserProfile} from "../../../../store/slices/userSlice";
import {useDispatch} from "react-redux";

export function HomePage() {
    const dispatch = useDispatch()
    const user = useProfile()

    useEffect(() => {
        dispatch(getUserProfile())
    }, []);

    return (
        <div>
            <h1 className={styles.homePage__title}>👋 Добро пожаловать, {user.firstName}</h1>
            <h1 className={styles.projects__title}>Мои проекты</h1>
        </div>
    )
}
