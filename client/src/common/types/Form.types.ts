import { IProduct } from "../../store/models/product.interface";

export type OnChangeModel = {
    value: string | number | boolean,
    error: string,
    touched: boolean,
    field: string,
    name: string,
    label: string,
};

export interface IFormStateField<T> {error: string, value: T};

export interface IProductFormState {
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
    box: IFormStateField<string>;
    rack: IFormStateField<string>;
    category: IFormStateField<string>;
    qr_code: IFormStateField<string>;
    manufacturedate: IFormStateField<Date>;
    expiredate: IFormStateField<Date>;
    type_of_space : IFormStateField<string>;
    document_type : IFormStateField<string>;
    retension_time :IFormStateField<object>;
    document_request_info:any
    
    
     
}
export interface IBoxFormState {
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
    racks: IFormStateField<number>;  
}
export  interface IOrderFormState {
    name: IFormStateField<string>;
    product: IFormStateField<IProduct | null>;
    amount: IFormStateField<number>;
    totalPrice: IFormStateField<number>;
};

export interface IDocCategoryFormState {
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
}
export interface IDocTypeFormState {
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
    
}
export interface IDocDepartmentFormState {
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
}
 


export interface IDocRequestFormState {
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
    empl_id: IFormStateField<string>;
    doc_type: IFormStateField<number>;
    request_no: IFormStateField<string>;
    requested_doc : IFormStateField<RequestDocuments>;
}

export interface IDocApprovalFormState
{
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
    empl_id: IFormStateField<string>;
    doc_type: IFormStateField<number>;
    request_no: IFormStateField<string>;
    requested_doc : IFormStateField<RequestDocuments>;
}
export interface IDocIssuanceFormState
{
    _id: IFormStateField<string>;
    name: IFormStateField<string>;
    description: IFormStateField<string>;
    empl_id: IFormStateField<string>;
    doc_type: IFormStateField<number>;
    request_no: IFormStateField<string>;
    requested_doc : IFormStateField<RequestDocuments>;
}
export interface RequestDocuments {
    RequestDocuments:  Array<RequestDocument>;
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