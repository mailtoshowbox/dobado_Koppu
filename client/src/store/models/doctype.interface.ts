export interface IDocType {
    _id: string;
    name: string;
    description: string;
 
}

export enum DocTypeModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IDocTypeList extends Array<IDocType>{}