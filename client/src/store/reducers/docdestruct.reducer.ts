import { IDocDestructState, IActionBase } from "../models/root.interface";
import { LOAD_DOCUMENT_DESTRUCT_LIST,SET_DOCUMENT_DESTRUCT_MODIFICATION_STATE,CHANGE_DOCUMENT_DESTRUCT_EDIT, SET_DOCUMENT_DESTRUCT_DATES} from "../actions/docdestruct.action"; 
import { IProductDestruct, ProductDestructModificationStatus } from "../models/productDesctruct.interface";


const initialState: IDocDestructState = {     
    docDestructList: [],
    modificationState: ProductDestructModificationStatus.None,
    selectedDocForDestruct: null,
    searchDates:{startDate : null, endDate:null},
     
};

function docCategoriesReducer(state: IDocDestructState = initialState, action: IActionBase): IDocDestructState {
    switch (action.type) {         
        case LOAD_DOCUMENT_DESTRUCT_LIST: { 
            return { ...state, docDestructList:  action.docDestructList};
        } 
        case SET_DOCUMENT_DESTRUCT_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case SET_DOCUMENT_DESTRUCT_DATES: {
            console.log("Action:", action);
            return { ...state, searchDates: action.dates };
        }
        case CHANGE_DOCUMENT_DESTRUCT_EDIT: { 
            return { ...state, selectedDocForDestruct: action.docForDestruct };
        }
        default:
            return state;
    }
}


export default docCategoriesReducer;