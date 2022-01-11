import { IProduct, ProductModificationStatus } from "./product.interface";
import { IBox, BoxModificationStatus } from "./box.interface";
import { IDocCategory, DocCategoryModificationStatus } from "./doccategory.interface";
import { IDocIssuance, DocIssuanceModificationStatus } from "./docIssuance.interface";
import { IDocType, DocTypeModificationStatus } from "./doctype.interface";
import { IDocRequest, DocRequestModificationStatus } from "./docrequest.interface";
import { IDocDepartment, DocDepartmentModificationStatus } from "./docdepartment.interface";
import { IDocApproval, DocApprovalModificationStatus } from "./docapproval.interface";
import { IDocIssuanceTakeout, DocIssuanceTakeoutModificationStatus } from "./docIssuancetakeout.interface";
import { IProductDestruct, ProductDestructModificationStatus } from "./productDesctruct.interface";

import { IAuditLog } from "./auditLog.interface";

import { INotification } from "./notification.interface";
import { IUser } from "./user.interface";
import { IOrder } from "./order.interface";
import { IAccount } from "./account.interface";



export interface IRootPageStateType {
    area: string;
    subArea: string;
}export interface IRootOption {
    id: string;
    name: string;
}
export interface IRootStateType {
    page: IRootPageStateType;
}
export interface IProductSubmitState {
    productSubmit: IProduct[];
    selectedForProductSubmit: IProduct | null;
    modificationState: ProductModificationStatus;
}
export interface IStateType {
    root: IRootStateType;
    products: IProductState;
    productSubmit: IProductSubmitState;
    notifications: INotificationState;
    users: IUserState;
    orders: IOrdersState;
    account: IAccount;
    boxes: IBoxState;
    docCategories: IDocCategoryState;
    docDepartments: IDocDepartmentState;
    docTypes: IDocTypeState;
    docRequests: IDocRequestState;
    docApprovals: IDocApprovalState;
    docIssuances: IDocIssuanceState;
    home: any;
    docLogSheetData: IDocLogSheetState;
    docDestructData: IDocDestructState;
    docIssuancesTakeout: IDocIssuanceTakeoutState;
    auditLogList: IAuditLogState;
    
}
export interface IDocIssuanceTakeoutState {
    docIssuancesTakeout: IDocIssuanceTakeout[];
    selectedDocIssuanceTakeout: IDocIssuanceTakeout | null;
    modificationState: DocIssuanceTakeoutModificationStatus;
}
export interface IDocIssuanceState {
    docIssuances: IDocIssuance[];
    selectedDocIssuance: IDocIssuance | null;
    modificationState: DocIssuanceModificationStatus;
}
export interface IDocApprovalState {
    docApprovals: IDocApproval[];
    selectedDocApproval: IDocApproval | null;
    modificationState: DocApprovalModificationStatus;
}
export interface IProductState {
    products: IProduct[];
    selectedProduct: IProduct | null;
    modificationState: ProductModificationStatus;
}
export interface IDocLogSheetState {
    docLogSheetList: IProduct[];
 }

 export interface IAuditLogState {
    auditLogList: IAuditLog[];
 }

 export interface IDocDestructState {
    docDestructList: IProductDestruct[];
    selectedDocForDestruct: IProductDestruct | null;
    modificationState: ProductDestructModificationStatus;
    searchDates: any;
       
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
    docDepartments: IDocDepartment[];
}

export interface IBoxState {
    boxes: IBox[];
    selectedBox: IBox | null;
    modificationState: BoxModificationStatus;
}

export interface IDocCategoryState {
    docCategories: IDocCategory[];
    selectedDocCategory: IDocCategory | null;
    modificationState: DocCategoryModificationStatus;
}

export interface IDocTypeState {
    docTypes: IDocType[];
    selectedDocType: IDocType | null;
    modificationState: DocTypeModificationStatus;
}

export interface IDocRequestState {
    docRequests: IDocRequest[];
    selectedDocRequest: IDocRequest | null;
    modificationState: DocRequestModificationStatus;
}
export interface IDocDepartmentState {
    docDepartments: IDocDepartment[];
    selectedDocDepartment: IDocDepartment | null;
    modificationState: DocDepartmentModificationStatus;
}
