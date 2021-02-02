export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    name: string;
    auth:any;
    roles:any;
}

export interface IUserList extends Array<IUser>{}