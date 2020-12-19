import { IProduct, ProductModificationStatus } from "./product.interface";
import { IBox, BoxModificationStatus } from "./box.interface";
import { INotification } from "./notification.interface";
import { IUser } from "./user.interface";
import { IOrder } from "./order.interface";
import { IAccount } from "./account.interface";

export interface IRootPageStateType {
    area: string;
    subArea: string;
}

export interface IRootStateType {
    page: IRootPageStateType;
}
export interface IStateType {
    root: IRootStateType;
    products: IProductState;
    notifications: INotificationState;
    users: IUserState;
    orders: IOrdersState;
    account: IAccount;
    boxes: IBoxState;
}

export interface IProductState {
    products: IProduct[];
    selectedProduct: IProduct | null;
    modificationState: ProductModificationStatus;
}

export interface IActionBase {
    type: string;
    [prop: string]: any;
}

export interface IOrdersState {
    orders: IOrder[];
}

export interface INotificationState {
    notifications: INotification[];
}

export interface IUserState {
    users: IUser[];
    admins: IUser[];
}

export interface IBoxState {
    boxes: IBox[];
    selectedBox: IBox | null;
    modificationState: BoxModificationStatus;
}