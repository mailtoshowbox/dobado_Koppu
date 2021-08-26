import { RequestDocument } from "./docrequest.interface";
export interface IDocIssuance {
    _id: string;
    name: string;
    description: string;
    empl_id: string;
    doc_type: number;
    request_no: string;
    requested_doc : Array<RequestDocument> 
    approval : Array<RequestDocumentApproval> 
    emp_code_approval_1: string;
    emp_code_approval_2: string;
    doc_issuance_status:  DocRequestIssuanceStatus,
    doc_requested_department : any
 
}
export interface DocRequestIssuanceStatus {
    is_issued: boolean,
    issued_on:  Date,
    doc_issued_by: Array<RequestDocumentIssuedBy>,
}

export interface RequestDocumentIssuedBy {
    empl_id: string;
    empl_email_id: string;
}
export interface RequestDocumentApproval {
    empl_id: string;
    empl_email_id: string;
    status: string; 
    approve_access_level: string; //Manager/Quality user
}
/* export interface RequestDocument {
    _id: string;  
    no_of_copy: string;
    empl_id: string;
    doc_type: number;
    request_no: string;
    is_doc_approved : boolean
    document_name: string;
    document_no: string;  
    no_of_page: number; 
} */
 
export enum DocIssuanceModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IDocIssuanceList extends Array<IDocIssuance>{}