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
}

export interface RequestDocumentApproval {
    empl_id: string;
    empl_email_id: string;
    status: string; 
    approve_access_level: string; //Manager/Quality user
}
export interface RequestDocument {
    _id: string;
    doc_no: string;
    doc_name: string;
    no_of_copy: string;
    empl_id: string;
    doc_type: number;
    request_no: string;
}

export enum DocRequestModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IDocRequestList extends Array<IDocRequest>{}