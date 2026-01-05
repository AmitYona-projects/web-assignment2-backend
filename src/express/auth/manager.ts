

interface ILoginData {
    email: string;
    password: string;
}

interface IRegisterData {
    email: string;
    password: string;
}

interface ILogoutData {
    token: string;
}

interface IRefreshTokenData {
    token: string;
}
export class AuthManager {
    static login = async (loginData: ILoginData): Promise<string> => {
        return "Login successful";
    };

    static register = async (registerData: IRegisterData): Promise<string> => {
        return "Register successful";
    };

    static logout = async (logoutData: ILogoutData): Promise<string> => {
        return "Logout successful";
    };

    static refreshToken = async (refreshTokenData: IRefreshTokenData): Promise<string> => {
        return "Refresh token successful";
    };
}