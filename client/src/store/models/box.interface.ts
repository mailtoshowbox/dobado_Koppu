export interface IBox {
    _id: string;
    name: string;
    description: string;
    racks: number;
    rackList : IRackList
}

export interface IRack {
    _id: string;
    name: string; 
    box: string; 
    status: string;
    picked: boolean;    
}

export enum BoxModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IBoxList extends Array<IBox>{}
export interface IRackList extends Array<IRack>{}