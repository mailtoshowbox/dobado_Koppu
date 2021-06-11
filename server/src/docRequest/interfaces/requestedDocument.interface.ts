export interface RequestedDocument {
  id?: string;
  document_no: string;
  document_name: string;  
  no_of_copy: number;  
  no_of_page: number;  
  reason_for_request: string;  
  isActive: boolean;
} 