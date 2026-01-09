import { Request } from "express";

export interface ILoginData {
    email: string;
    password: string;
}

export interface IRegisterData {
    email: string;
    password: string;
    username: string;
}

export interface ILogoutData {
    refreshToken: string;
}

export interface IRefreshTokenData {
    refreshToken: string;
}

export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    user?: {
        _id: string;
        email: string;
        username: string;
    };
}

export interface ITokenInfo {
    _id: string;
}

export interface AuthRequest extends Request {
    user: ITokenInfo;
}
