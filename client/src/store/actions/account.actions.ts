export const LOG_IN: string = "LOG_IN";
export const LOG_OUT: string = "LOG_OUT";

export function login(loginData: any): ILogInActionType {
    return { type: LOG_IN,  loginData };
}

export function logout(): ILogOutActionType {
    return { type: LOG_OUT};
}

interface ILogInActionType { type: string, loginData: any };
interface ILogOutActionType { type: string };
