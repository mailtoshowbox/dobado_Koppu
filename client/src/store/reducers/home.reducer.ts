import {  IActionBase } from "../models/root.interface";
import { LIST_DOCCATEGORY} from "../actions/home.action";
import {  DocCategoryModificationStatus } from "../models/doccategory.interface";



const initialState: any = {
    modificationState: DocCategoryModificationStatus.None,
    selectedDocCategory: null,
    home: {}
};

function docCategoriesReducer(state: any = initialState, action: IActionBase): any {
    switch (action.type) {         
        case LIST_DOCCATEGORY: { 
            return { ...state, home:  {...action}};
        }        
      
        default:
            return state;
    }
}


export default docCategoriesReducer;