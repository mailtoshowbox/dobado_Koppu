import { IDocLogSheetState, IActionBase } from "../models/root.interface";
import { LOAD_DOCUMENT_LOG_SHEET} from "../actions/doclogsheet.action"; 



const initialState: IDocLogSheetState = {     
    docLogSheetList: []
};

function docCategoriesReducer(state: IDocLogSheetState = initialState, action: IActionBase): IDocLogSheetState {
    switch (action.type) {         
        case LOAD_DOCUMENT_LOG_SHEET: { 
            return { ...state, docLogSheetList:  action.docLogSheetList};
        } 
        default:
            return state;
    }
}


export default docCategoriesReducer;