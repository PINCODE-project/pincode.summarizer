import {useQuery} from '@tanstack/react-query';
import {UserService} from "../services/user.service";

export function useUser() {
    const {data, isLoading} = useQuery({
        queryKey: ['getUserProfile'],
        queryFn: () => UserService.getProfile(),
        select: data => data.data
    })

    return {user: data, isLoading}
}
