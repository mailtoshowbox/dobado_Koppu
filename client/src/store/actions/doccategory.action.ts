import { IDocCategory, DocCategoryModificationStatus } from "../models/doccategory.interface";
export const ADD_DOCCATEGORY: string = "ADD_DOCCATEGORY";
export const EDIT_DOCCATEGORY: string = "EDIT_DOCCATEGORY";
export const REMOVE_DOCCATEGORY: string = "REMOVE_DOCCATEGORY";
export const CHANGE_DOCCATEGORY_AMOUNT: string = "CHANGE_DOCCATEGORY_AMOUNT";
export const CHANGE_DOCCATEGORY_PENDING_EDIT: string = "CHANGE_DOCCATEGORY_PENDING_EDIT";
export const CLEAR_DOCCATEGORY_PENDING_EDIT: string = "CLEAR_DOCCATEGORY_PENDING_EDIT";
export const SET_DOCCATEGORY_MODIFICATION_STATE: string = "SET_DOCCATEGORY_MODIFICATION_STATE";
export const LIST_DOCCATEGORY: string = "LIST_DOCCATEGORY";




    export function loadListOfDocCategory(items : IDocCategoryList) { 
  
            return { type: LIST_DOCCATEGORY , docCategories:  items  };
        
       
    
        }
export function addDocCategory(docCategory: IDocCategory): IAddDocCategoryActionType {
    return { type: ADD_DOCCATEGORY, docCategory: docCategory };
}

export function editDocCategory(docCategory: IDocCategory): IEditDocCategoryActionType {
    return { type: EDIT_DOCCATEGORY, docCategory: docCategory };
}

export function removeDocCategory(id: number): IRemoveDocCategoryActionType {
    return { type: REMOVE_DOCCATEGORY, id: id };
}

export function changeDocCategoryAmount(id: number, amount: number): IChangeDocCategoryAmountType {
    return { type: CHANGE_DOCCATEGORY_AMOUNT, id: id, amount: amount };
}

export function changeSelectedDocCategory(docCategory: IDocCategory): IChangeSelectedDocCategoryActionType {
    console.log("docCategory---", docCategory);
    return { type: CHANGE_DOCCATEGORY_PENDING_EDIT, docCategory: docCategory };
}

export function clearSelectedDocCategory(): IClearSelectedDocCategoryActionType {
    return { type: CLEAR_DOCCATEGORY_PENDING_EDIT };
}

export function setModificationState(value: DocCategoryModificationStatus): ISetModificationStateActionType {
    return { type: SET_DOCCATEGORY_MODIFICATION_STATE, value: value };
}

interface IAddDocCategoryActionType { type: string, docCategory: IDocCategory };
interface IEditDocCategoryActionType { type: string, docCategory: IDocCategory };
interface IRemoveDocCategoryActionType { type: string, id: number };
interface IChangeSelectedDocCategoryActionType { type: string, docCategory: IDocCategory };
interface IClearSelectedDocCategoryActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  DocCategoryModificationStatus};
interface IChangeDocCategoryAmountType {type: string, id: number, amount: number};
 

interface IDocCategoryList extends Array<IDocCategory>{}
 