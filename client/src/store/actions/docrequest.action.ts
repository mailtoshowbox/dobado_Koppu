import { IDocRequest, DocRequestModificationStatus } from "../models/docrequest.interface";
export const ADD_DOCREQUEST: string = "ADD_DOCREQUEST";
export const EDIT_DOCREQUEST: string = "EDIT_DOCREQUEST";
export const REMOVE_DOCREQUEST: string = "REMOVE_DOCREQUEST";
export const CHANGE_DOCREQUEST_AMOUNT: string = "CHANGE_DOCREQUEST_AMOUNT";
export const CHANGE_DOCREQUEST_PENDING_EDIT: string = "CHANGE_DOCREQUEST_PENDING_EDIT";
export const CLEAR_DOCREQUEST_PENDING_EDIT: string = "CLEAR_DOCREQUEST_PENDING_EDIT";
export const SET_DOCREQUEST_MODIFICATION_STATE: string = "SET_DOCREQUEST_MODIFICATION_STATE";
export const LIST_DOCREQUEST: string = "LIST_DOCREQUEST";
export const LOAD_APPROVED_USER: string = "LOAD_APPROVED_USER";




    export function loadListOfDocRequest(items : IDocRequestList) { 
      
            return { type: LIST_DOCREQUEST , docRequests:  items  };
        
       
    
        }
export function addDocRequest(docRequest: IDocRequest): IAddDocRequestActionType {
    return { type: ADD_DOCREQUEST, docRequest: docRequest };
}

export function editDocRequest(docRequest: IDocRequest): IEditDocRequestActionType {
    return { type: EDIT_DOCREQUEST, docRequest: docRequest };
}

export function removeDocRequest(id: number): IRemoveDocRequestActionType {
    return { type: REMOVE_DOCREQUEST, id: id };
}

export function changeDocRequestAmount(id: number, amount: number): IChangeDocRequestAmountType {
    return { type: CHANGE_DOCREQUEST_AMOUNT, id: id, amount: amount };
}

export function changeSelectedDocRequest(docRequest: IDocRequest): IChangeSelectedDocRequestActionType {
    return { type: CHANGE_DOCREQUEST_PENDING_EDIT, docRequest: docRequest };
}

export function clearSelectedDocRequest(): IClearSelectedDocRequestActionType {
    return { type: CLEAR_DOCREQUEST_PENDING_EDIT };
}

export function setModificationState(value: DocRequestModificationStatus): ISetModificationStateActionType {
    return { type: SET_DOCREQUEST_MODIFICATION_STATE, value: value };
}
export function loadedApprovedUser(value: any) {
    console.log("value------", value);
    return { type: LOAD_APPROVED_USER, value: value };
}


interface IAddDocRequestActionType { type: string, docRequest: IDocRequest };
interface IEditDocRequestActionType { type: string, docRequest: IDocRequest };
interface IRemoveDocRequestActionType { type: string, id: number };
interface IChangeSelectedDocRequestActionType { type: string, docRequest: IDocRequest };
interface IClearSelectedDocRequestActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  DocRequestModificationStatus};
interface IChangeDocRequestAmountType {type: string, id: number, amount: number};
 

interface IDocRequestList extends Array<IDocRequest>{}
 