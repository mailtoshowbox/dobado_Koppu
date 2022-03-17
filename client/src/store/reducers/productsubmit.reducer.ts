import { IProductSubmitState, IActionBase } from "../models/root.interface";
import { ADD_PRODUCT, CHANGE_PRODUCT_PENDING_EDIT, EDIT_SUBMIT_PRODUCT, REMOVE_PRODUCT,
    CLEAR_PRODUCT_PENDING_EDIT, SET_PRODUCT_MODIFICATION_STATE, CHANGE_PRODUCT_AMOUNT, LIST_SUBMIT_PRODUCT, UPDATE_QR_CODE} from "../actions/productsubmit.action";
import { IProduct, ProductModificationStatus } from "../models/product.interface";



const initialState: IProductSubmitState = {
    modificationState: ProductModificationStatus.None,
    selectedForProductSubmit: null,
    productSubmit: []
};

function productsReducer(state: IProductSubmitState = initialState, action: IActionBase): IProductSubmitState {
    switch (action.type) {    
        case UPDATE_QR_CODE:{ 
            const foundIndex: number = state.productSubmit.findIndex(pr => pr._id === action.qrCodeFor);
            let products: IProduct[] = state.productSubmit;
            products[foundIndex] = {...state.productSubmit[foundIndex], ['qr_code'] : action.qrCodeFor};
            return { ...state, productSubmit: products };            
        }  
        case LIST_SUBMIT_PRODUCT: { 
            return { ...state, productSubmit:  action.productSubmit};
        }        
        case ADD_PRODUCT: {
          //  let maxId: number = Math.max.apply(Math, state.products.map(function(o) { return o._id; }));
          //  action.product.id = maxId + 1;
            return { ...state, productSubmit: [...state.productSubmit, action.product]};
        }
        case EDIT_SUBMIT_PRODUCT: {
            const foundIndex: number = state.productSubmit.findIndex(pr => pr._id === action.product._id);
            let products: IProduct[] = state.productSubmit;
            products[foundIndex] = action.product;
            return { ...state, productSubmit: products };
        }
        case REMOVE_PRODUCT: {
            return { ...state, productSubmit: state.productSubmit.filter(pr => pr._id !== action.id) };
        }
        case CHANGE_PRODUCT_PENDING_EDIT: {
            return { ...state, selectedForProductSubmit: action.product };
        }
        case CLEAR_PRODUCT_PENDING_EDIT: {
            return { ...state, selectedForProductSubmit: null };
        }
        case SET_PRODUCT_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_PRODUCT_AMOUNT: {
           // const foundIndex: number = state.products.findIndex(pr => pr._id === action.id);
            let products: IProduct[] = state.productSubmit;
            return { ...state, productSubmit: products };
        }
        default:
            return state;
    }
}


export default productsReducer;