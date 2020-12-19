export interface IBox {
    _id: string;
    name: string;
    description: string;
    racks: number;
}

export enum BoxModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IBoxList extends Array<IBox>{}