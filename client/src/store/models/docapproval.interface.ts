import { RequestDocument } from "./docrequest.interface";
export interface IDocApproval {
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
    page_from: string;
    rejectDocumentRequest:  RejectDocumentRequest,
    comments: string; 
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
export interface RejectDocumentRequest {
    is_rejected: boolean,
    rejected_by: string;
    rejected_on: Date,
    rejected_reason: string
    rejected_from_page: string
}

export enum DocApprovalModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IDocApprovalList extends Array<IDocApproval>{}