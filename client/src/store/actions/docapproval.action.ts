import { IDocApproval, DocApprovalModificationStatus } from "../models/docapproval.interface";
export const ADD_DOCAPPROVAL: string = "ADD_DOCAPPROVAL";
export const EDIT_DOCAPPROVAL: string = "EDIT_DOCAPPROVAL";
export const REMOVE_DOCAPPROVAL: string = "REMOVE_DOCAPPROVAL";
export const CHANGE_DOCAPPROVAL_AMOUNT: string = "CHANGE_DOCAPPROVAL_AMOUNT";
export const CHANGE_DOCAPPROVAL_PENDING_EDIT: string = "CHANGE_DOCAPPROVAL_PENDING_EDIT";
export const CLEAR_DOCAPPROVAL_PENDING_EDIT: string = "CLEAR_DOCAPPROVAL_PENDING_EDIT";
export const SET_DOCAPPROVAL_MODIFICATION_STATE: string = "SET_DOCAPPROVAL_MODIFICATION_STATE";
export const LIST_DOCAPPROVAL: string = "LIST_DOCAPPROVAL";
export const LOAD_APPROVED_USER: string = "LOAD_APPROVED_USER";




    export function loadListOfDocApproval(items : IDocApprovalList) { 

      
            return { type: LIST_DOCAPPROVAL , docApprovals:  items  };
        
       
    
        }
export function updateDocRequestApproval(docApproval: IDocApproval): IAddDocApprovalActionType {
    return { type: ADD_DOCAPPROVAL, docApproval: docApproval };
}



export function editDocApproval(docApproval: IDocApproval): IEditDocApprovalActionType {
    return { type: EDIT_DOCAPPROVAL, docApproval: docApproval };
}

export function removeDocApproval(id: number): IRemoveDocApprovalActionType {
    return { type: REMOVE_DOCAPPROVAL, id: id };
}

export function changeDocApprovalAmount(id: number, amount: number): IChangeDocApprovalAmountType {
    return { type: CHANGE_DOCAPPROVAL_AMOUNT, id: id, amount: amount };
}

export function changeSelectedDocApproval(docApproval: IDocApproval): IChangeSelectedDocApprovalActionType {
    return { type: CHANGE_DOCAPPROVAL_PENDING_EDIT, docApproval: docApproval };
}

export function clearSelectedDocApproval(): IClearSelectedDocApprovalActionType {
    return { type: CLEAR_DOCAPPROVAL_PENDING_EDIT };
}

export function setModificationState(value: DocApprovalModificationStatus): ISetModificationStateActionType {
    return { type: SET_DOCAPPROVAL_MODIFICATION_STATE, value: value };
}
export function loadedApprovedUser(value: any) {
    return { type: LOAD_APPROVED_USER, value: value };
}


interface IAddDocApprovalActionType { type: string, docApproval: IDocApproval };
interface IEditDocApprovalActionType { type: string, docApproval: IDocApproval };
interface IRemoveDocApprovalActionType { type: string, id: number };
interface IChangeSelectedDocApprovalActionType { type: string, docApproval: IDocApproval };
interface IClearSelectedDocApprovalActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  DocApprovalModificationStatus};
interface IChangeDocApprovalAmountType {type: string, id: number, amount: number};
 

interface IDocApprovalList extends Array<IDocApproval>{}
 