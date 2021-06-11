import { IDocDepartmentState, IActionBase } from "../models/root.interface";
import { ADD_DOCDEPARTMENT, CHANGE_DOCDEPARTMENT_PENDING_EDIT, EDIT_DOCDEPARTMENT, REMOVE_DOCDEPARTMENT,
    CLEAR_DOCDEPARTMENT_PENDING_EDIT, SET_DOCDEPARTMENT_MODIFICATION_STATE, CHANGE_DOCDEPARTMENT_AMOUNT, LIST_DOCDEPARTMENT} from "../actions/docdepartment.action";
import { IDocDepartment, DocDepartmentModificationStatus } from "../models/docdepartment.interface";



const initialState: IDocDepartmentState = {
    modificationState: DocDepartmentModificationStatus.None,
    selectedDocDepartment: null,
    docDepartments: []
};

function docDepartmentsReducer(state: IDocDepartmentState = initialState, action: IActionBase): IDocDepartmentState {
    switch (action.type) {         
        case LIST_DOCDEPARTMENT: { 
            return { ...state, docDepartments:  action.docDepartments};
        }        
        case ADD_DOCDEPARTMENT: {
          //  let maxId: number = Math.max.apply(Math, state.docDepartments.map(function(o) { return o._id; }));
          //  action.product.id = maxId + 1; 
            return { ...state, docDepartments: [...state.docDepartments, action.docDepartment]};
        }
        case EDIT_DOCDEPARTMENT: {
            const foundIndex: number = state.docDepartments.findIndex(pr => pr._id === action.docDepartment._id);
            let docDepartments: IDocDepartment[] = state.docDepartments;
            docDepartments[foundIndex] = action.docDepartment;
            return { ...state, docDepartments: docDepartments };
        }
        case REMOVE_DOCDEPARTMENT: {
            return { ...state, docDepartments: state.docDepartments.filter(pr => pr._id !== action.id) };
        }
        case CHANGE_DOCDEPARTMENT_PENDING_EDIT: {
            return { ...state, selectedDocDepartment: action.docDepartment };
        }
        case CLEAR_DOCDEPARTMENT_PENDING_EDIT: {
            return { ...state, selectedDocDepartment: null };
        }
        case SET_DOCDEPARTMENT_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_DOCDEPARTMENT_AMOUNT: {
            //const foundIndex: number = state.docDepartments.findIndex(pr => pr._id === action.id);
            let docDepartments: IDocDepartment[] = state.docDepartments;
            return { ...state, docDepartments: docDepartments };
        }
        default:
            return state;
    }
}


export default docDepartmentsReducer;