import { IDocTypeState, IActionBase } from "../models/root.interface";
import { ADD_DOCTYPE, CHANGE_DOCTYPE_PENDING_EDIT, EDIT_DOCTYPE, REMOVE_DOCTYPE,
    CLEAR_DOCTYPE_PENDING_EDIT, SET_DOCTYPE_MODIFICATION_STATE, CHANGE_DOCTYPE_AMOUNT, LIST_DOCTYPE} from "../actions/doctype.action";
import { IDocType, DocTypeModificationStatus } from "../models/doctype.interface";



const initialState: IDocTypeState = {
    modificationState: DocTypeModificationStatus.None,
    selectedDocType: null,
    docTypes: []
};

function docTypesReducer(state: IDocTypeState = initialState, action: IActionBase): IDocTypeState {
    switch (action.type) {         
        case LIST_DOCTYPE: { 
            return { ...state, docTypes:  action.docTypes};
        }        
        case ADD_DOCTYPE: {
          //  let maxId: number = Math.max.apply(Math, state.docTypes.map(function(o) { return o._id; }));
          //  action.product.id = maxId + 1; 
            return { ...state, docTypes: [...state.docTypes, action.docType]};
        }
        case EDIT_DOCTYPE: {
            const foundIndex: number = state.docTypes.findIndex(pr => pr._id === action.docType._id);
            let docTypes: IDocType[] = state.docTypes;
            docTypes[foundIndex] = action.docType;
            return { ...state, docTypes: docTypes };
        }
        case REMOVE_DOCTYPE: {
            return { ...state, docTypes: state.docTypes.filter(pr => pr._id !== action.id) };
        }
        case CHANGE_DOCTYPE_PENDING_EDIT: {
            return { ...state, selectedDocType: action.docType };
        }
        case CLEAR_DOCTYPE_PENDING_EDIT: {
            return { ...state, selectedDocType: null };
        }
        case SET_DOCTYPE_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_DOCTYPE_AMOUNT: {
            const foundIndex: number = state.docTypes.findIndex(pr => pr._id === action.id);
            let docTypes: IDocType[] = state.docTypes;
            return { ...state, docTypes: docTypes };
        }
        default:
            return state;
    }
}


export default docTypesReducer;