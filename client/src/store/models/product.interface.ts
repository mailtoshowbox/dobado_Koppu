export interface IProduct {
    _id: string;
    name: string;
    description: string;
    box: string;
    rack:  string;
    category :  string;
    type_of_space:  string;
    qr_code:  string;
    manufacturedate: Date;  
    expiredate: Date;   

   /*  box_info:  Array<IProduct>;
    rack_info:   Array<Info>;
    category_info :   Array<Info>; */
}

interface Info{
    id : string
    name : string,
}

export enum ProductModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IProductList extends Array<IProduct>{}