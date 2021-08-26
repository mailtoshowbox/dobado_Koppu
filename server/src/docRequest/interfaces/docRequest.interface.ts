
 interface DOC_ISSUED_BY {
  document_id: string;
  document_issued_on:Date;
  empl_email_id: string;
  empl_id:string;
  document_issued_by:string;
}
interface DOC_ISSUANCE_STATUS {
 doc_issued_by : Array<DOC_ISSUED_BY>
} 


export interface DocRequest {
  requested_doc: any;
  id?: string;
  empl_id: string;
  doc_type: string;  
  request_no: string;  
  isActive: boolean; 
  issuance :any;
  
  
} 

 interface RequestedDoc {
  id?: string;
  empl_id: string;
  doc_type: string;  
  request_no: string;  
  isActive: boolean;
  request_id : string;
} 