import { IDocApprovalState, IActionBase } from "../models/root.interface";
import { ADD_DOCAPPROVAL, CHANGE_DOCAPPROVAL_PENDING_EDIT, EDIT_DOCAPPROVAL, REMOVE_DOCAPPROVAL,
    CLEAR_DOCAPPROVAL_PENDING_EDIT, SET_DOCAPPROVAL_MODIFICATION_STATE, CHANGE_DOCAPPROVAL_AMOUNT, LIST_DOCAPPROVAL} from "../actions/docapproval.action";
import { IDocApproval, DocApprovalModificationStatus } from "../models/docapproval.interface";



const initialState: IDocApprovalState = {
    modificationState: DocApprovalModificationStatus.None,
    selectedDocApproval: null,
    docApprovals: []
};

function docApprovalReducer(state: IDocApprovalState = initialState, action: IActionBase): IDocApprovalState {
    switch (action.type) {         
        case LIST_DOCAPPROVAL: { 
            
            return { ...state, docApprovals:  action.docApprovals};
        }        
        case ADD_DOCAPPROVAL: {
          //  let maxId: number = Math.max.apply(Math, state.docApproval.map(function(o) { return o._id; }));
          //  action.product.id = maxId + 1;  
            return { ...state, docApprovals: [...state.docApprovals, action.docRequest]};
        }
        case EDIT_DOCAPPROVAL: {
            const foundIndex: number = state.docApprovals.findIndex(pr => pr._id === action.docApproval._id);
            let docApproval: IDocApproval[] = state.docApprovals;
            docApproval[foundIndex] = action.docApproval;
            return { ...state, docApprovals: docApproval };
        }
        case REMOVE_DOCAPPROVAL: {
            return { ...state, docApprovals: state.docApprovals.filter(pr => pr._id !== action.id) };
        }
        case CHANGE_DOCAPPROVAL_PENDING_EDIT: {
            console.log("action---", action);
            return { ...state, selectedDocApproval: action.docApproval };
        }
        case CLEAR_DOCAPPROVAL_PENDING_EDIT: {
            return { ...state, selectedDocApproval: null };
        }
        case SET_DOCAPPROVAL_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_DOCAPPROVAL_AMOUNT: {
            //const foundIndex: number = state.docApproval.findIndex(pr => pr._id === action.id);
            let docApproval: IDocApproval[] = state.docApprovals;
            return { ...state, docApprovals: docApproval };
        }
        default:
            return state;
    }
}


export default docApprovalReducer;