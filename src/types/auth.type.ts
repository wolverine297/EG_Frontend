export interface IUser {
    id?: string;
    email: string;
    password: string;
    name: string;
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IAuthResponse {
    user: IUser;
    token: string;
}