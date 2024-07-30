import axios from 'axios'
import {ConfigService} from "./config.service";

export class AuthService {
    static login(login, password) {
        return axios.post(ConfigService.URLS.LOGIN, {login, password})
    }

    static async isTokenValid(token) {
        return await axios.get(ConfigService.URLS.IS_VALID_TOKEN, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )
    }
}
