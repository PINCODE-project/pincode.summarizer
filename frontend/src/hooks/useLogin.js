import {useMutation} from "@tanstack/react-query";
import {AuthService} from "../services/auth.service";
import {localStorageKeys} from "../core/models/localStorageKeys";

export function useLogin(onSuccess, onError) {
    const {data, mutate, isPending, error} = useMutation({
        mutationKey: ['login'],
        mutationFn: (values) => AuthService.login(values.login, values.password),
        select: data => data.data,
        onError: (error) => onError(error.response),
        onSuccess: (response) => {
            localStorage.setItem(localStorageKeys.accessToken, response.data.accessToken)
            localStorage.setItem(localStorageKeys.login, response.data.login)
            localStorage.setItem(localStorageKeys.userId, response.data.id)
            onSuccess(response.data)
        }
    })

    return {login: data, mutate, isPending, error}
}
