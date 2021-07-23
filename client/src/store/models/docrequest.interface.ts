export interface IDocRequest {
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
    comments : string;
    issuance : Array<RequestDocumentIssuance> 
}
export interface RequestDocumentIssuance {
    empl_id: string;
    empl_email_id: string;
    status: string; 
    approve_access_level: string; //Manager/Quality user
}
export interface RequestDocumentApproval {
    empl_id: string;
    empl_email_id: string;
    status: string; 
    approve_access_level: string; //Manager/Quality user
}
export interface RequestDocument {
    _id: string;  
    no_of_copy: string;
    empl_id: string;
    doc_type: number;
    request_no: string;
    is_doc_approved : boolean
    document_name: string;
    document_no: string;  
    no_of_page: number; 
    doc_issuance: DocIssuance; 
}
export interface RejectDocument {
    is_rejected: boolean,
    rejected_by: string;
    rejected_on: Date,
    rejected_reason: string
    rejected_from_page: string
}
export interface DocIssuance {
    is_rejected: Array<IssuedDocument>    
}
export interface IssuedDocument {
    _id: string;  
    no_of_copy: string;
    empl_id: string;
    doc_type: number;
    request_no: string;
    is_doc_approved : boolean
    document_name: string;
    document_no: string;  
    no_of_page: number;  
}
export interface ApproveDocument {
    is_rejected: boolean,
    rejected_by: string;
    rejected_on: Date,
    rejected_reason: string
    rejected_from_page: string
}

export enum DocRequestModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IDocRequestList extends Array<IDocRequest>{}