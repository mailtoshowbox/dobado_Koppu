import { IUserState, IActionBase } from "../models/root.interface";
import { ADD_ADMIN, REMOVE_ADMIN,LIST_USER, LIST_DOC_DEPARTMENT } from "../actions/users.action";
 
 

const initialState: IUserState = {
    users: [        

    ],
    admins: [
         
    ],
    docDepartments : []
};

function userReducer(state: IUserState = initialState, action: IActionBase): IUserState {
    switch (action.type) {
        case LIST_USER: { 
            return { ...state, 
                users:  action.users.data.data.users.filter((x:any)=>x.roles[0] === "Deactivated"),
                admins:  action.users.data.data.users.filter((x:any)=>x.roles[0] !== "Deactivated"),

            };
        } 
        case ADD_ADMIN: {
            return { ...state, users: state.users.filter(x=>x.id !== action.user.id), admins: [...state.admins, action.user]};
        }
        case REMOVE_ADMIN: {
            return { ...state, admins: state.admins.filter(x=>x.id !== action.user.id), users: [...state.users, action.user]};
        }
        case LIST_DOC_DEPARTMENT: { 
            return { ...state, docDepartments:  action.docDepartments};
        }
        default:
            return state;
    }
}

export default userReducer;