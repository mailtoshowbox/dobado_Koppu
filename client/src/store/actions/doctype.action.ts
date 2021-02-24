import { IDocType, DocTypeModificationStatus } from "../models/doctype.interface";
export const ADD_DOCTYPE: string = "ADD_DOCTYPE";
export const EDIT_DOCTYPE: string = "EDIT_DOCTYPE";
export const REMOVE_DOCTYPE: string = "REMOVE_DOCTYPE";
export const CHANGE_DOCTYPE_AMOUNT: string = "CHANGE_DOCTYPE_AMOUNT";
export const CHANGE_DOCTYPE_PENDING_EDIT: string = "CHANGE_DOCTYPE_PENDING_EDIT";
export const CLEAR_DOCTYPE_PENDING_EDIT: string = "CLEAR_DOCTYPE_PENDING_EDIT";
export const SET_DOCTYPE_MODIFICATION_STATE: string = "SET_DOCTYPE_MODIFICATION_STATE";
export const LIST_DOCTYPE: string = "LIST_DOCTYPE";




    export function loadListOfDocType(items : IDocTypeList) {  
  
            return { type: LIST_DOCTYPE , docTypes:  items  };
        
       
    
        }
export function addDocType(docType: IDocType): IAddDocTypeActionType {
    return { type: ADD_DOCTYPE, docType: docType };
}

export function editDocType(docType: IDocType): IEditDocTypeActionType {
    return { type: EDIT_DOCTYPE, docType: docType };
}

export function removeDocType(id: number): IRemoveDocTypeActionType {
    return { type: REMOVE_DOCTYPE, id: id };
}

export function changeDocTypeAmount(id: number, amount: number): IChangeDocTypeAmountType {
    return { type: CHANGE_DOCTYPE_AMOUNT, id: id, amount: amount };
}

export function changeSelectedDocType(docType: IDocType): IChangeSelectedDocTypeActionType {
    return { type: CHANGE_DOCTYPE_PENDING_EDIT, docType: docType };
}

export function clearSelectedDocType(): IClearSelectedDocTypeActionType {
    return { type: CLEAR_DOCTYPE_PENDING_EDIT };
}

export function setModificationState(value: DocTypeModificationStatus): ISetModificationStateActionType {
    return { type: SET_DOCTYPE_MODIFICATION_STATE, value: value };
}

interface IAddDocTypeActionType { type: string, docType: IDocType };
interface IEditDocTypeActionType { type: string, docType: IDocType };
interface IRemoveDocTypeActionType { type: string, id: number };
interface IChangeSelectedDocTypeActionType { type: string, docType: IDocType };
interface IClearSelectedDocTypeActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  DocTypeModificationStatus};
interface IChangeDocTypeAmountType {type: string, id: number, amount: number};
 

interface IDocTypeList extends Array<IDocType>{}
 