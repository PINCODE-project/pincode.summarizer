import axios from 'axios'
import {ConfigService} from "./config.service";
import {localStorageKeys} from "../core/models/localStorageKeys";

export class UserService {
    static getProfile() {
        return axios.get(ConfigService.URLS.GET_PROFILE, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(localStorageKeys.accessToken)}`
            }
        })
    }
}
