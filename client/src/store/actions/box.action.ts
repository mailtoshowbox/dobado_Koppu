import { IBox, BoxModificationStatus } from "../models/box.interface";
export const ADD_BOX: string = "ADD_BOX";
export const EDIT_BOX: string = "EDIT_BOX";
export const REMOVE_BOX: string = "REMOVE_BOX";
export const CHANGE_BOX_AMOUNT: string = "CHANGE_BOX_AMOUNT";
export const CHANGE_BOX_PENDING_EDIT: string = "CHANGE_BOX_PENDING_EDIT";
export const CLEAR_BOX_PENDING_EDIT: string = "CLEAR_BOX_PENDING_EDIT";
export const SET_BOX_MODIFICATION_STATE: string = "SET_BOX_MODIFICATION_STATE";
export const LIST_BOX: string = "LIST_BOX";

export function loadListOfBox(items : IBoxList) {   
    return { type: LIST_BOX , boxes:  items  };      
}

export function addBox(box: IBox): IAddBoxActionType {
    return { type: ADD_BOX, box: box };
}

export function editBox(box: IBox): IEditBoxActionType {
    return { type: EDIT_BOX, box: box };
}

export function removeBox(id: number): IRemoveBoxActionType {
    return { type: REMOVE_BOX, id: id };
}

export function changeBoxAmount(id: number, amount: number): IChangeBoxAmountType {
    return { type: CHANGE_BOX_AMOUNT, id: id, amount: amount };
}

export function changeSelectedBox(box: IBox): IChangeSelectedBoxActionType {
    return { type: CHANGE_BOX_PENDING_EDIT, box: box };
}

export function clearSelectedBox(): IClearSelectedBoxActionType {
    return { type: CLEAR_BOX_PENDING_EDIT };
}

export function setModificationState(value: BoxModificationStatus): ISetModificationStateActionType {
    return { type: SET_BOX_MODIFICATION_STATE, value: value };
}

interface IAddBoxActionType { type: string, box: IBox };
interface IEditBoxActionType { type: string, box: IBox };
interface IRemoveBoxActionType { type: string, id: number };
interface IChangeSelectedBoxActionType { type: string, box: IBox };
interface IClearSelectedBoxActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  BoxModificationStatus};
interface IChangeBoxAmountType {type: string, id: number, amount: number};
 

interface IBoxList extends Array<IBox>{}
 