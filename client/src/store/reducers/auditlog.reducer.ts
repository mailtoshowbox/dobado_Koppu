import { IAuditLogState, IActionBase } from "../models/root.interface";
import { LOAD_DOCUMENT_AUDIT_LOG_SHEET} from "../actions/auditlog.action"; 



const initialState: IAuditLogState = {     
    auditLogList: []
};

function auditLogReducer(state: IAuditLogState = initialState, action: IActionBase): IAuditLogState {
    switch (action.type) {         
        case LOAD_DOCUMENT_AUDIT_LOG_SHEET: { 
            return { ...state, auditLogList:  action.auditLogList};
        } 
        default:
            return state;
    }
}


export default auditLogReducer;