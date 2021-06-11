export class CreateDocRequestDto { 
  readonly empl_id: string; 
  readonly doc_type: string; 
  readonly request_no: string; 
  readonly isActive: boolean; 
  readonly requested_doc: []; 
  readonly approval: []; 
} 