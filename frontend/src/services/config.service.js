export class ConfigService {
    // static HOST = 'https://pincode-dev.ru/swagger-provider'
    static HOST = 'https://dev.pincode-dev.ru/voice-brief'
    static API = `${this.HOST}/api`
    static STATIC = `${this.API}/static`

    static URLS = {
        LOGIN: `${this.API}/auth/login`,
        IS_VALID_TOKEN: `${this.API}/auth/profile`,
        GET_PROFILE: `${this.API}/user/`,
        UPLOAD_RECORD: `${this.API}/record/upload`,
        GET_RECORDS: `${this.API}/record`,
        TRANSCRIBE_RECORD: `${this.API}/record/transcribe`,
        SUMMARIZE_RECORD: `${this.API}/record/summarize`,
    }
}
