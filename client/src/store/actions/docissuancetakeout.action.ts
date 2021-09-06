import { IDocIssuanceTakeout, DocIssuanceTakeoutModificationStatus } from "../models/docIssuancetakeout.interface";
export const ADD_DOC_ISSUANCE_TAKEOUT: string = "ADD_DOC_ISSUANCE_TAKEOUT";
export const EDIT_DOC_ISSUANCE_TAKEOUT: string = "EDIT_DOC_ISSUANCE_TAKEOUT";
export const REMOVE_DOC_ISSUANCE_TAKEOUT: string = "REMOVE_DOC_ISSUANCE_TAKEOUT";
export const CHANGE_DOC_ISSUANCE_TAKEOUT_AMOUNT: string = "CHANGE_DOC_ISSUANCE_TAKEOUT_AMOUNT";
export const CHANGE_DOC_ISSUANCE_TAKEOUT_PENDING_EDIT: string = "CHANGE_DOC_ISSUANCE_TAKEOUT_PENDING_EDIT";
export const CLEAR_DOC_ISSUANCE_TAKEOUT_PENDING_EDIT: string = "CLEAR_DOC_ISSUANCE_TAKEOUT_PENDING_EDIT";
export const SET_DOC_ISSUANCE_TAKEOUT_MODIFICATION_STATE: string = "SET_DOC_ISSUANCE_TAKEOUT_MODIFICATION_STATE";
export const LIST_DOC_ISSUANCE_TAKEOUT: string = "LIST_DOC_ISSUANCE_TAKEOUT";




    export function loadListOfDocIssuanceTakeout(items : IDocIssuanceTakeoutList) {   
            return { type: LIST_DOC_ISSUANCE_TAKEOUT , docIssuancesTakeout:  items  };     
        }
export function addDocCategory(docCategory: IDocIssuanceTakeout): IAddDocCategoryActionType {
    return { type: ADD_DOC_ISSUANCE_TAKEOUT, docCategory: docCategory };
}

export function editDocCategory(docCategory: IDocIssuanceTakeout): IEditDocCategoryActionType {
    return { type: EDIT_DOC_ISSUANCE_TAKEOUT, docCategory: docCategory };
}

export function removeDocCategory(id: number): IRemoveDocCategoryActionType {
    return { type: REMOVE_DOC_ISSUANCE_TAKEOUT, id: id };
}

export function changeDocCategoryAmount(id: number, amount: number): IChangeDocCategoryAmountType {
    return { type: CHANGE_DOC_ISSUANCE_TAKEOUT_AMOUNT, id: id, amount: amount };
}

export function changeSelectedDocIssuance(docIssuance: IDocIssuanceTakeout): IChangeSelectedDocCategoryActionType {
    
    return { type: CHANGE_DOC_ISSUANCE_TAKEOUT_PENDING_EDIT, selectedDocIssuanceTakeout: docIssuance };
}

export function clearSelectedDocIssuance(): IClearSelectedDocCategoryActionType {
    return { type: CLEAR_DOC_ISSUANCE_TAKEOUT_PENDING_EDIT };
}

export function setModificationState(value: DocIssuanceTakeoutModificationStatus): ISetModificationStateActionType {
    console.log("value-----", value);
    return { type: SET_DOC_ISSUANCE_TAKEOUT_MODIFICATION_STATE, value: value };
}

interface IAddDocCategoryActionType { type: string, docCategory: IDocIssuanceTakeout };
interface IEditDocCategoryActionType { type: string, docCategory: IDocIssuanceTakeout };
interface IRemoveDocCategoryActionType { type: string, id: number };
interface IChangeSelectedDocCategoryActionType { type: string, selectedDocIssuanceTakeout: IDocIssuanceTakeout };
interface IClearSelectedDocCategoryActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  DocIssuanceTakeoutModificationStatus};
interface IChangeDocCategoryAmountType {type: string, id: number, amount: number};
 

interface IDocIssuanceTakeoutList extends Array<IDocIssuanceTakeout>{}
 