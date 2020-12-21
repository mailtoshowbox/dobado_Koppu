export interface IDocCategory {
    _id: string;
    name: string;
    description: string;
 
}

export enum DocCategoryModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IDocCategoryList extends Array<IDocCategory>{}