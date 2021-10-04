import { IDocDestructState, IActionBase } from "../models/root.interface";
import { LOAD_DOCUMENT_DESTRUCT_LIST,SET_DOCUMENT_DESTRUCT_MODIFICATION_STATE,CHANGE_DOCUMENT_DESTRUCT_EDIT} from "../actions/docdestruct.action"; 
import { IProductDestruct, ProductDestructModificationStatus } from "../models/productDesctruct.interface";


const initialState: IDocDestructState = {     
    docDestructList: [],
    modificationState: ProductDestructModificationStatus.None,
    selectedDocForDestruct: null,
};

function docCategoriesReducer(state: IDocDestructState = initialState, action: IActionBase): IDocDestructState {
    switch (action.type) {         
        case LOAD_DOCUMENT_DESTRUCT_LIST: { 
            console.log("REDU", action);
            return { ...state, docDestructList:  action.docDestructList};
        } 
        case SET_DOCUMENT_DESTRUCT_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_DOCUMENT_DESTRUCT_EDIT: { 
            return { ...state, selectedDocForDestruct: action.docForDestruct };
        }
        default:
            return state;
    }
}


export default docCategoriesReducer;