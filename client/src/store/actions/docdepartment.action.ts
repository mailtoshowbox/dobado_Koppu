import { IDocDepartment, DocDepartmentModificationStatus } from "../models/docdepartment.interface";
export const ADD_DOCDEPARTMENT: string = "ADD_DOCDEPARTMENT";
export const EDIT_DOCDEPARTMENT: string = "EDIT_DOCDEPARTMENT";
export const REMOVE_DOCDEPARTMENT: string = "REMOVE_DOCDEPARTMENT";
export const CHANGE_DOCDEPARTMENT_AMOUNT: string = "CHANGE_DOCDEPARTMENT_AMOUNT";
export const CHANGE_DOCDEPARTMENT_PENDING_EDIT: string = "CHANGE_DOCDEPARTMENT_PENDING_EDIT";
export const CLEAR_DOCDEPARTMENT_PENDING_EDIT: string = "CLEAR_DOCDEPARTMENT_PENDING_EDIT";
export const SET_DOCDEPARTMENT_MODIFICATION_STATE: string = "SET_DOCDEPARTMENT_MODIFICATION_STATE";
export const LIST_DOCDEPARTMENT: string = "LIST_DOCDEPARTMENT";




    export function loadListOfDocDepartment(items : IDocDepartmentList) { 
  
            return { type: LIST_DOCDEPARTMENT , docDepartments:  items  };
        
       
    
        }
export function addDocDepartment(docDepartment: IDocDepartment): IAddDocDepartmentActionType {
    return { type: ADD_DOCDEPARTMENT, docDepartment: docDepartment };
}

export function editDocDepartment(docDepartment: IDocDepartment): IEditDocDepartmentActionType {
    return { type: EDIT_DOCDEPARTMENT, docDepartment: docDepartment };
}

export function removeDocDepartment(id: number): IRemoveDocDepartmentActionType {
    return { type: REMOVE_DOCDEPARTMENT, id: id };
}

export function changeDocDepartmentAmount(id: number, amount: number): IChangeDocDepartmentAmountType {
    return { type: CHANGE_DOCDEPARTMENT_AMOUNT, id: id, amount: amount };
}

export function changeSelectedDocDepartment(docDepartment: IDocDepartment): IChangeSelectedDocDepartmentActionType {
    return { type: CHANGE_DOCDEPARTMENT_PENDING_EDIT, docDepartment: docDepartment };
}

export function clearSelectedDocDepartment(): IClearSelectedDocDepartmentActionType {
    return { type: CLEAR_DOCDEPARTMENT_PENDING_EDIT };
}

export function setModificationState(value: DocDepartmentModificationStatus): ISetModificationStateActionType {
    return { type: SET_DOCDEPARTMENT_MODIFICATION_STATE, value: value };
}

interface IAddDocDepartmentActionType { type: string, docDepartment: IDocDepartment };
interface IEditDocDepartmentActionType { type: string, docDepartment: IDocDepartment };
interface IRemoveDocDepartmentActionType { type: string, id: number };
interface IChangeSelectedDocDepartmentActionType { type: string, docDepartment: IDocDepartment };
interface IClearSelectedDocDepartmentActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  DocDepartmentModificationStatus};
interface IChangeDocDepartmentAmountType {type: string, id: number, amount: number};
 

interface IDocDepartmentList extends Array<IDocDepartment>{}
 