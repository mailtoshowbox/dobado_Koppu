export interface IProduct {
    _id: string;
    name: string;
    description: string;
    box: string;
    rack: number;
}

export enum ProductModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IProductList extends Array<IProduct>{}