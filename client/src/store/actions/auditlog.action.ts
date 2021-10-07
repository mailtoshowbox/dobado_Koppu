//import { IDocLogSheet } from "../models/doclogsheet.interface";

import { IAuditLog } from "../models/auditLog.interface";

 
export const LOAD_DOCUMENT_AUDIT_LOG_SHEET: string = "LOAD_DOCUMENT_AUDIT_LOG_SHEET";




    export function loadAuditLog(items : IAuditLogList) { 
  
            return { type: LOAD_DOCUMENT_AUDIT_LOG_SHEET , auditLogList:  items  };
        
       
    
        }
  
interface IAuditLogList extends Array<IAuditLog>{}
 