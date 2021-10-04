import { IProductDestruct, ProductDestructModificationStatus } from "../models/productDesctruct.interface";
export const LOAD_DOCUMENT_DESTRUCT_LIST: string = "LOAD_DOCUMENT_DESTRUCT_LIST";
export const CHANGE_DOCUMENT_DESTRUCT_EDIT: string = "CHANGE_DOCUMENT_DESTRUCT_EDIT";
 
export const SET_DOCUMENT_DESTRUCT_MODIFICATION_STATE: string = "SET_DOCUMENT_DESTRUCT_MODIFICATION_STATE";
    export function loadDocumentDescSheet(items : IProductDestructList) { 
       
  
            return { type: LOAD_DOCUMENT_DESTRUCT_LIST , docDestructList:  items  };
        
        }
        export function changeSelectedDocForDestruct(docForDestruct: IProductDestruct): IChangeSelectedDocDesctActionType {
            return { type: CHANGE_DOCUMENT_DESTRUCT_EDIT, docForDestruct: docForDestruct };
        }
        export function setModificationState(value: ProductDestructModificationStatus): ISetModificationStateActionType {
            return { type: SET_DOCUMENT_DESTRUCT_MODIFICATION_STATE, value: value };
        }
        interface ISetModificationStateActionType { type: string, value: ProductDestructModificationStatus};
        interface IChangeSelectedDocDesctActionType { type: string, docForDestruct: IProductDestruct };
interface IProductDestructList extends Array<IProductDestruct>{}

 