import { IUser,IUserList } from "../models/user.interface";

export const ADD_ADMIN: string = "ADD_ADMIN";
export const REMOVE_ADMIN: string = "REMOVE_ADMIN";
export const LIST_USER: string = "LIST_USER";


export function loadListOfuser(items : IUserList) {   
    return { type: LIST_USER , users:  items  };      
}


export function addAdmin(user: IUser): IAddAdminActionType {
    return { type: ADD_ADMIN, user: user };
}

export function removeAdmin(user: IUser): IRemoveAdminActionType {
    return { type: REMOVE_ADMIN, user: user };
}


interface IAddAdminActionType { type: string, user: IUser };
interface IRemoveAdminActionType { type: string, user: IUser };
