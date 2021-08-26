export interface IDoc {
    _id: string;
    name: string;
    description: string;
    box: string;
    rack:  string;
    category :  string; //compactor
    document_type :  string;
    type_of_space:  string;
    qr_code:  string;
    manufacturedate: Date;  
    expiredate: Date;  
    document_info : any; 
    retension_time: { time: Number, defaultYear: Number,calculateNonPerceptualTime : String },
 
}


export enum ProductModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IDocLogSheet extends Array<IDoc>{}