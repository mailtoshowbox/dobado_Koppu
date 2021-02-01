import { IActionBase } from "../models/root.interface";
import { IAccount } from "../models/account.interface";
import { LOG_IN, LOG_OUT } from "../actions/account.actions";

const initialState: IAccount = {
    email: "" ,
    roles:[] 
};

function accountReducer(state: IAccount = initialState, action: IActionBase): IAccount { 
    switch (action.type) {
        case LOG_IN: {
            return { ...state, ...action.loginData};
        }
        case LOG_OUT: {
            return { ...state, email: ""};
        }
        default:
            return state;
    }
}


export default accountReducer;