export interface DocRequest {
  requested_doc: any;
  id?: string;
  empl_id: string;
  doc_type: string;  
  request_no: string;  
  isActive: boolean; 
  
} 

 interface RequestedDoc {
  id?: string;
  empl_id: string;
  doc_type: string;  
  request_no: string;  
  isActive: boolean;
  request_id : string;
} 