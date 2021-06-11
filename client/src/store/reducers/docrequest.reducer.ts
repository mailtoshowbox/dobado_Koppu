import { IDocRequestState, IActionBase } from "../models/root.interface";
import { ADD_DOCREQUEST, CHANGE_DOCREQUEST_PENDING_EDIT, EDIT_DOCREQUEST, REMOVE_DOCREQUEST,
    CLEAR_DOCREQUEST_PENDING_EDIT, SET_DOCREQUEST_MODIFICATION_STATE, CHANGE_DOCREQUEST_AMOUNT, LIST_DOCREQUEST} from "../actions/docrequest.action";
import { IDocRequest, DocRequestModificationStatus } from "../models/docrequest.interface";



const initialState: IDocRequestState = {
    modificationState: DocRequestModificationStatus.None,
    selectedDocRequest: null,
    docRequests: []
};

function docRequestsReducer(state: IDocRequestState = initialState, action: IActionBase): IDocRequestState {
    switch (action.type) {         
        case LIST_DOCREQUEST: { 
            return { ...state, docRequests:  action.docRequests};
        }        
        case ADD_DOCREQUEST: {
          //  let maxId: number = Math.max.apply(Math, state.docRequests.map(function(o) { return o._id; }));
          //  action.product.id = maxId + 1;  
            return { ...state, docRequests: [...state.docRequests, action.docRequest]};
        }
        case EDIT_DOCREQUEST: {
            const foundIndex: number = state.docRequests.findIndex(pr => pr._id === action.docCategory._id);
            let docRequests: IDocRequest[] = state.docRequests;
            docRequests[foundIndex] = action.docCategory;
            return { ...state, docRequests: docRequests };
        }
        case REMOVE_DOCREQUEST: {
            return { ...state, docRequests: state.docRequests.filter(pr => pr._id !== action.id) };
        }
        case CHANGE_DOCREQUEST_PENDING_EDIT: {
            return { ...state, selectedDocRequest: action.docCategory };
        }
        case CLEAR_DOCREQUEST_PENDING_EDIT: {
            return { ...state, selectedDocRequest: null };
        }
        case SET_DOCREQUEST_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_DOCREQUEST_AMOUNT: {
            //const foundIndex: number = state.docRequests.findIndex(pr => pr._id === action.id);
            let docRequests: IDocRequest[] = state.docRequests;
            return { ...state, docRequests: docRequests };
        }
        default:
            return state;
    }
}


export default docRequestsReducer;