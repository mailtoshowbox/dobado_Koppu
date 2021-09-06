import { IDocIssuanceTakeoutState, IActionBase } from "../models/root.interface";
import { ADD_DOC_ISSUANCE_TAKEOUT, CHANGE_DOC_ISSUANCE_TAKEOUT_PENDING_EDIT, EDIT_DOC_ISSUANCE_TAKEOUT, REMOVE_DOC_ISSUANCE_TAKEOUT,
    CLEAR_DOC_ISSUANCE_TAKEOUT_PENDING_EDIT, SET_DOC_ISSUANCE_TAKEOUT_MODIFICATION_STATE, CHANGE_DOC_ISSUANCE_TAKEOUT_AMOUNT, LIST_DOC_ISSUANCE_TAKEOUT} from "../actions/docissuancetakeout.action";
import { IDocIssuanceTakeout, DocIssuanceTakeoutModificationStatus } from "../models/docIssuancetakeout.interface";



const initialState: IDocIssuanceTakeoutState = {
    modificationState: DocIssuanceTakeoutModificationStatus.None,
    selectedDocIssuanceTakeout: null,
    docIssuancesTakeout: []
};

function docIssuancesTakeoutReducer(state: IDocIssuanceTakeoutState = initialState, action: IActionBase): IDocIssuanceTakeoutState {
    switch (action.type) {         
        case LIST_DOC_ISSUANCE_TAKEOUT: { 
            return { ...state, docIssuancesTakeout:  action.docIssuancesTakeout};
        }        
        case ADD_DOC_ISSUANCE_TAKEOUT: {
          //  let maxId: number = Math.max.apply(Math, state.docIssuances.map(function(o) { return o._id; }));
          //  action.product.id = maxId + 1; 
            return { ...state, docIssuancesTakeout: [...state.docIssuancesTakeout, action.docCategory]};
        }
        case EDIT_DOC_ISSUANCE_TAKEOUT: {
            const foundIndex: number = state.docIssuancesTakeout.findIndex(pr => pr._id === action.docCategory._id);
            let docIssuancesTakeout: IDocIssuanceTakeout[] = state.docIssuancesTakeout;
            docIssuancesTakeout[foundIndex] = action.docCategory;
            return { ...state, docIssuancesTakeout: docIssuancesTakeout };
        }
        case REMOVE_DOC_ISSUANCE_TAKEOUT: {
            return { ...state, docIssuancesTakeout: state.docIssuancesTakeout.filter(pr => pr._id !== action.id) };
        }
        case CHANGE_DOC_ISSUANCE_TAKEOUT_PENDING_EDIT: {

            return { ...state, selectedDocIssuanceTakeout: action.selectedDocIssuanceTakeout };
        }
        case CLEAR_DOC_ISSUANCE_TAKEOUT_PENDING_EDIT: {
            return { ...state, selectedDocIssuanceTakeout: null };
        }
        case SET_DOC_ISSUANCE_TAKEOUT_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_DOC_ISSUANCE_TAKEOUT_AMOUNT: {
            //const foundIndex: number = state.docIssuances.findIndex(pr => pr._id === action.id);
            let docIssuancesTakeout: IDocIssuanceTakeout[] = state.docIssuancesTakeout;
            return { ...state, docIssuancesTakeout: docIssuancesTakeout };
        }
        default:
            return state;
    }
}


export default docIssuancesTakeoutReducer;