import { IDocIssuanceState, IActionBase } from "../models/root.interface";
import { ADD_DOC_ISSUANCE, CHANGE_DOC_ISSUANCE_PENDING_EDIT, EDIT_DOC_ISSUANCE, REMOVE_DOC_ISSUANCE,
    CLEAR_DOC_ISSUANCE_PENDING_EDIT, SET_DOC_ISSUANCE_MODIFICATION_STATE, CHANGE_DOC_ISSUANCE_AMOUNT, LIST_DOC_ISSUANCE} from "../actions/docissuance.action";
import { IDocIssuance, DocIssuanceModificationStatus } from "../models/docIssuance.interface";



const initialState: IDocIssuanceState = {
    modificationState: DocIssuanceModificationStatus.None,
    selectedDocIssuance: null,
    docIssuances: []
};

function docIssuancesReducer(state: IDocIssuanceState = initialState, action: IActionBase): IDocIssuanceState {
    switch (action.type) {         
        case LIST_DOC_ISSUANCE: { 
            return { ...state, docIssuances:  action.docIssuances};
        }        
        case ADD_DOC_ISSUANCE: {
          //  let maxId: number = Math.max.apply(Math, state.docIssuances.map(function(o) { return o._id; }));
          //  action.product.id = maxId + 1; 
            return { ...state, docIssuances: [...state.docIssuances, action.docCategory]};
        }
        case EDIT_DOC_ISSUANCE: {
            const foundIndex: number = state.docIssuances.findIndex(pr => pr._id === action.docCategory._id);
            let docIssuances: IDocIssuance[] = state.docIssuances;
            docIssuances[foundIndex] = action.docCategory;
            return { ...state, docIssuances: docIssuances };
        }
        case REMOVE_DOC_ISSUANCE: {
            return { ...state, docIssuances: state.docIssuances.filter(pr => pr._id !== action.id) };
        }
        case CHANGE_DOC_ISSUANCE_PENDING_EDIT: {
            return { ...state, selectedDocIssuance: action.docIssuance };
        }
        case CLEAR_DOC_ISSUANCE_PENDING_EDIT: {
            return { ...state, selectedDocIssuance: null };
        }
        case SET_DOC_ISSUANCE_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_DOC_ISSUANCE_AMOUNT: {
            //const foundIndex: number = state.docIssuances.findIndex(pr => pr._id === action.id);
            let docIssuances: IDocIssuance[] = state.docIssuances;
            return { ...state, docIssuances: docIssuances };
        }
        default:
            return state;
    }
}


export default docIssuancesReducer;