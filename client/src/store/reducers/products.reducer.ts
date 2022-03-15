import { IProductState, IActionBase } from "../models/root.interface";
import { ADD_PRODUCT, CHANGE_PRODUCT_PENDING_EDIT, EDIT_PRODUCT, REMOVE_PRODUCT,
    CLEAR_PRODUCT_PENDING_EDIT, SET_PRODUCT_MODIFICATION_STATE, CHANGE_PRODUCT_AMOUNT, LIST_PRODUCT, UPDATE_QR_CODE} from "../actions/products.action";
import { IProduct, ProductModificationStatus } from "../models/product.interface";



const initialState: IProductState = {
    modificationState: ProductModificationStatus.None,
    selectedProduct: null,
    products: [],
    searchProductTriggered : false
};

function productsReducer(state: IProductState = initialState, action: IActionBase): IProductState {
    switch (action.type) {    
        case UPDATE_QR_CODE:{ 
            const foundIndex: number = state.products.findIndex(pr => pr._id === action.qrCodeFor);
            let products: IProduct[] = state.products;
            products[foundIndex] = {...state.products[foundIndex], ['qr_code'] : action.qrCodeFor};
            return { ...state, products: products };            
        }  
        case LIST_PRODUCT: {

            console.log("Current State", state);
            const newprod = JSON.parse(JSON.stringify({...state, products:  action.products, searchProductTriggered:true}));
      
            return  newprod;
        }        
        case ADD_PRODUCT: {
          //  let maxId: number = Math.max.apply(Math, state.products.map(function(o) { return o._id; }));
          //  action.product.id = maxId + 1;
            return { ...state, products: [...state.products, action.product], searchProductTriggered:true};
        }
        case EDIT_PRODUCT: {
            const foundIndex: number = state.products.findIndex(pr => pr._id === action.product._id);
            let products: IProduct[] = state.products;
            products[foundIndex] = action.product;
            return { ...state, products: products , searchProductTriggered:true};
        }
        case REMOVE_PRODUCT: {
            return { ...state, products: state.products.filter(pr => pr._id !== action.id) };
        }
        case CHANGE_PRODUCT_PENDING_EDIT: {
            return { ...state, selectedProduct: action.product };
        }
        case CLEAR_PRODUCT_PENDING_EDIT: {
            return { ...state, selectedProduct: null };
        }
        case SET_PRODUCT_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CHANGE_PRODUCT_AMOUNT: {
           // const foundIndex: number = state.products.findIndex(pr => pr._id === action.id);
            let products: IProduct[] = state.products;
            return { ...state, products: products };
        }
        default:
            return state;
    }
}


export default productsReducer;