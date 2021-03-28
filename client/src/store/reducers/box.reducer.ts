import { IBoxState, IActionBase } from "../models/root.interface";
import { ADD_BOX, CHANGE_BOX_PENDING_EDIT, EDIT_BOX, REMOVE_BOX,
    CLEAR_BOX_PENDING_EDIT, SET_BOX_MODIFICATION_STATE, CHANGE_BOX_AMOUNT, LIST_BOX} from "../actions/box.action";
import { IBox, BoxModificationStatus } from "../models/box.interface";



const initialState: IBoxState = {
    modificationState: BoxModificationStatus.None,
    selectedBox: null,
    boxes: [{
        _id: "1", name: "Chocolate", description: "This is Chocolate and it is Sweet", "racks" :2, rackList : []
    } ]
};

function boxsReducer(state: IBoxState = initialState, action: IActionBase): IBoxState {
    switch (action.type) {         
        case LIST_BOX: {
            return { ...state, boxes:  action.boxes};
        }        
        case ADD_BOX: {
           // let maxId: number = Math.max.apply(Math, state.boxes.map(function(o) { return o._id; }));
          //  action.box.id = maxId + 1;
            return { ...state, boxes: [...state.boxes, action.box]};
        }
        case EDIT_BOX: {
            const foundIndex: number = state.boxes.findIndex(pr => pr._id === action.box._id);
            let boxes: IBox[] = state.boxes;
            boxes[foundIndex] = action.box;
            return { ...state, boxes: boxes };
        }
        case REMOVE_BOX: {
            return { ...state, boxes: state.boxes.filter(pr => pr._id !== action.id) };
        }
        case CHANGE_BOX_PENDING_EDIT: {
            return { ...state, selectedBox: action.box };
        }
        case CLEAR_BOX_PENDING_EDIT: {
            return { ...state, selectedBox: null };
        }
        case SET_BOX_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_BOX_AMOUNT: {
            //const foundIndex: number = state.boxes.findIndex(pr => pr._id === action.id);
            let box: IBox[] = state.boxes;
            return { ...state, boxes: box };   
        }
        default:
            return state;
    }
}


export default boxsReducer;