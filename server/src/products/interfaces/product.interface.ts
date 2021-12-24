export interface Document {
  id?: string;
  name: string;
  description: string;
  box: string;
  rack:  string;
  category :  string; 
  box_info: [ Info ],
  rack_info: [ Info ],
  document_info : any,
  category_info: [Info],
  document_type : string; 
  docType_info: [Info],
  retension_time : any,
  isActive :  boolean;
  is_requested_for_takeout:  boolean;
  takeout_return_date :Date;
  is_requested_for_takeout_submit:boolean;
  is_requested_for_takeout_return:boolean;
  is_requested_for_takeout_return_approve:boolean;
  document_type_details :Info;
  document_category_details :Info;
  document_rack_details :Info;
  document_box_details :Info;
  docStatus :string; 

}

interface Info{
  id :  string;
  name :  string;
}
interface Info{
  id :  string;
  name :  string;
}
interface CDocument{
  isActive :  Boolean;  
}
  