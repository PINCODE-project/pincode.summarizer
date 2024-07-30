import axios from 'axios'
import {ConfigService} from './config.service';
import {localStorageKeys} from "../core/models/localStorageKeys";

export class RecordService {
    static uploadRecord(data) {
        return axios.post(ConfigService.URLS.UPLOAD_RECORD, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(localStorageKeys.accessToken)}`,
            }
        })
    }

    static getRecords() {
        return axios.get(ConfigService.URLS.GET_RECORDS, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(localStorageKeys.accessToken)}`
            }
        })
    }

    static getRecord(recordId) {
        return axios.get(`${ConfigService.URLS.GET_RECORDS}/${recordId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(localStorageKeys.accessToken)}`
            }
        })
    }

    static transcribe(recordId) {
        return axios.post(`${ConfigService.URLS.TRANSCRIBE_RECORD}/${recordId}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(localStorageKeys.accessToken)}`
            }
        })
    }

    static summarize(recordId) {
        return axios.post(`${ConfigService.URLS.SUMMARIZE_RECORD}/${recordId}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(localStorageKeys.accessToken)}`
            }
        })
    }
}
