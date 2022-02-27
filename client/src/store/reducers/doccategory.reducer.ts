import { IDocCategoryState, IActionBase } from "../models/root.interface";
import { ADD_DOCCATEGORY, CHANGE_DOCCATEGORY_PENDING_EDIT, EDIT_DOCCATEGORY, REMOVE_DOCCATEGORY,
    CLEAR_DOCCATEGORY_PENDING_EDIT, SET_DOCCATEGORY_MODIFICATION_STATE, CHANGE_DOCCATEGORY_AMOUNT, LIST_DOCCATEGORY} from "../actions/doccategory.action";
import { IDocCategory, DocCategoryModificationStatus } from "../models/doccategory.interface";



const initialState: IDocCategoryState = {
    modificationState: DocCategoryModificationStatus.None,
    selectedDocCategory: null,
    docCategories: []
};

function docCategoriesReducer(state: IDocCategoryState = initialState, action: IActionBase): IDocCategoryState {
    switch (action.type) {         
        case LIST_DOCCATEGORY: { 
            return { ...state, docCategories:  action.docCategories};
        }        
        case ADD_DOCCATEGORY: {
          //  let maxId: number = Math.max.apply(Math, state.docCategories.map(function(o) { return o._id; }));
          //  action.product.id = maxId + 1; 
            return { ...state, docCategories: [...state.docCategories, action.docCategory]};
        }
        case EDIT_DOCCATEGORY: {
            const foundIndex: number = state.docCategories.findIndex(pr => pr._id === action.docCategory._id);
            let docCategories: IDocCategory[] = state.docCategories;
            docCategories[foundIndex] = action.docCategory;
            return { ...state, docCategories: docCategories };
        }
        case REMOVE_DOCCATEGORY: {
            return { ...state, docCategories: state.docCategories.filter(pr => pr._id !== action.id) };
        }
        case CHANGE_DOCCATEGORY_PENDING_EDIT: {
            console.log("state-----", state, action);
            return { ...state, selectedDocCategory: action.docCategory };
        }
        case CLEAR_DOCCATEGORY_PENDING_EDIT: {
            return { ...state, selectedDocCategory: null };
        }
        case SET_DOCCATEGORY_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_DOCCATEGORY_AMOUNT: {
            //const foundIndex: number = state.docCategories.findIndex(pr => pr._id === action.id);
            let docCategories: IDocCategory[] = state.docCategories;
            return { ...state, docCategories: docCategories };
        }
        default:
            return state;
    }
}


export default docCategoriesReducer;