import { IDocIssuance, DocIssuanceModificationStatus } from "../models/docIssuance.interface";
export const ADD_DOC_ISSUANCE: string = "ADD_DOC_ISSUANCE";
export const EDIT_DOC_ISSUANCE: string = "EDIT_DOC_ISSUANCE";
export const REMOVE_DOC_ISSUANCE: string = "REMOVE_DOC_ISSUANCE";
export const CHANGE_DOC_ISSUANCE_AMOUNT: string = "CHANGE_DOC_ISSUANCE_AMOUNT";
export const CHANGE_DOC_ISSUANCE_PENDING_EDIT: string = "CHANGE_DOC_ISSUANCE_PENDING_EDIT";
export const CLEAR_DOC_ISSUANCE_PENDING_EDIT: string = "CLEAR_DOC_ISSUANCE_PENDING_EDIT";
export const SET_DOC_ISSUANCE_MODIFICATION_STATE: string = "SET_DOC_ISSUANCE_MODIFICATION_STATE";
export const LIST_DOC_ISSUANCE: string = "LIST_DOC_ISSUANCE";




    export function loadListOfDocIssuance(items : IDocIssuanceList) { 
  
            return { type: LIST_DOC_ISSUANCE , docIssuances:  items  };
        
       
    
        }
export function addDocCategory(docCategory: IDocIssuance): IAddDocCategoryActionType {
    return { type: ADD_DOC_ISSUANCE, docCategory: docCategory };
}

export function editDocCategory(docCategory: IDocIssuance): IEditDocCategoryActionType {
    return { type: EDIT_DOC_ISSUANCE, docCategory: docCategory };
}

export function removeDocCategory(id: number): IRemoveDocCategoryActionType {
    return { type: REMOVE_DOC_ISSUANCE, id: id };
}

export function changeDocCategoryAmount(id: number, amount: number): IChangeDocCategoryAmountType {
    return { type: CHANGE_DOC_ISSUANCE_AMOUNT, id: id, amount: amount };
}

export function changeSelectedDocIssuance(docIssuance: IDocIssuance): IChangeSelectedDocCategoryActionType {
    return { type: CHANGE_DOC_ISSUANCE_PENDING_EDIT, docIssuance: docIssuance };
}

export function clearSelectedDocIssuance(): IClearSelectedDocCategoryActionType {
    return { type: CLEAR_DOC_ISSUANCE_PENDING_EDIT };
}

export function setModificationState(value: DocIssuanceModificationStatus): ISetModificationStateActionType {
    return { type: SET_DOC_ISSUANCE_MODIFICATION_STATE, value: value };
}

interface IAddDocCategoryActionType { type: string, docCategory: IDocIssuance };
interface IEditDocCategoryActionType { type: string, docCategory: IDocIssuance };
interface IRemoveDocCategoryActionType { type: string, id: number };
interface IChangeSelectedDocCategoryActionType { type: string, docIssuance: IDocIssuance };
interface IClearSelectedDocCategoryActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  DocIssuanceModificationStatus};
interface IChangeDocCategoryAmountType {type: string, id: number, amount: number};
 

interface IDocIssuanceList extends Array<IDocIssuance>{}
 