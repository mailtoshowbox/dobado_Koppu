import { IBoxState, IActionBase } from "../models/root.interface";
import { ADD_BOX, CHANGE_BOX_PENDING_EDIT, EDIT_BOX, REMOVE_BOX,
    CLEAR_BOX_PENDING_EDIT, SET_MODIFICATION_STATE, CHANGE_BOX_AMOUNT, LIST_BOX} from "../actions/box.action";
import { IBox, BoxModificationStatus } from "../models/box.interface";



const initialState: IBoxState = {
    modificationState: BoxModificationStatus.None,
    selectedBox: null,
    boxes: [{
        _id: 1, name: "Chocolate", description: "This is Chocolate and it is Sweet", "racks" :2
    },
    {
        _id: 2, name: "Apple", description: "This is Apple and it is healthy" , "racks" :2
    },
    {
        _id: 3, name: "Straw", description: "This is Straw and you can use it for your drink" , "racks" :2
    },
    {
        _id: 4, name: "Spoon", description: "This is Spoon and it is useful while eating" , "racks" :2
    },
    {
        _id: 5, name: "Sugar", description: "This is Sugar and it is to make your life sweet" , "racks" :2
    }]
};

function productsReducer(state: IBoxState = initialState, action: IActionBase): IBoxState {
    switch (action.type) {         
        case LIST_BOX: {
            return { ...state, boxes:  action.boxes};
        }        
        case ADD_BOX: {
            let maxId: number = Math.max.apply(Math, state.boxes.map(function(o) { return o._id; }));
            action.product.id = maxId + 1;
            return { ...state, boxes: [...state.boxes, action.product]};
        }
        case EDIT_BOX: {
            const foundIndex: number = state.boxes.findIndex(pr => pr._id === action.product._id);
            let boxes: IBox[] = state.boxes;
            boxes[foundIndex] = action.product;
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
        case SET_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_BOX_AMOUNT: {
            const foundIndex: number = state.boxes.findIndex(pr => pr._id === action.id);
            let box: IBox[] = state.boxes;
            return { ...state, boxes: box };   
        }
        default:
            return state;
    }
}


export default productsReducer;