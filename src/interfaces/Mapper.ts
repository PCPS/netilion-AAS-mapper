export type AuthType = 'Bearer' | 'Basic';
export type AuthMode = 'INTERNAL' | 'BY_USER';
export type AuthStatus = 'EXPIRED' | 'RELAID' | 'REFRESHED' | 'REFRESH_FAILED';
export type OAUTH_REQUEST_BODY = OAUTH_PASSWORD | OAUTH_REFRESH;

export interface OAUTH_PASSWORD {
    client_id: string;
    client_secret: string;
    grant_type: 'password';
    username: string;
    password: string;
}
export interface OAUTH_REFRESH {
    client_id: string;
    client_secret: string;
    grant_type: 'refresh_token';
    refresh_token: string;
}
export interface OAUTH_TOKEN {
    access_token: string;
    token_type: AuthType;
    expires_in?: number;
    refresh_token?: string;
    created_at?: number;
}
export interface AUTH_RESULT {
    status: AuthStatus;
    response?: OAUTH_TOKEN;
}
