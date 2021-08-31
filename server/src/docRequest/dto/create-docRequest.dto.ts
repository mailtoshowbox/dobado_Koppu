export class CreateDocRequestDto { 
  readonly empl_id: string; 
  readonly doc_type: string; 
  readonly request_no: string; 
  readonly isActive: boolean; 
  readonly requested_doc: any; 
  readonly approval: []; 
  readonly rejectDocumentRequest: {}; 
  readonly comments: string;   
  readonly issuance: {};   
  readonly doc_requested_department: {};   
  readonly doc_requested_doctype: {};   
  
} 