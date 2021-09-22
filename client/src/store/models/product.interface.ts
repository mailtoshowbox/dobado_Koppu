export interface IProduct {
    _id: string;
    name: string;
    description: string;
    box: string;
    rack: string;
    category: string; //compactor
    document_type: string;
    type_of_space: string;
    qr_code: string;
    manufacturedate: Date;
    expiredate: Date;
    document_info: any;
    retension_time: { time: Number, defaultYear: Number, calculateNonPerceptualTime: String },
    document_request_info: any;
    is_requested_for_takeout: boolean;
    takeout_return_date: Date;
    /*  box_info:  Array<IProduct>;
     rack_info:   Array<Info>;
     category_info :   Array<Info>; */
    takeout_requested_details: any;
    doc_requested_department: any;
    document_type_details:any;
}


export enum ProductModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IProductList extends Array<IProduct> { }