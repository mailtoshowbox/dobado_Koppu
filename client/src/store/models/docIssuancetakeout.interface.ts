import { RequestDocument } from "./docrequest.interface";
export interface IDocIssuanceTakeout {
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
    issuance:  DocRequestIssuanceStatus,
    doc_requested_department : any,
    doc_requested_doctype :any
 
}
export interface DocRequestIssuanceStatus {
    is_issued: boolean,
    issued_on:  Date,
    doc_issued_by: Array<RequestDocumentIssuedBy>,
    is_doc_issuance_cancelled : boolean,
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
export enum DocIssuanceTakeoutModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IDocIssuanceTakeoutList extends Array<IDocIssuanceTakeout>{}