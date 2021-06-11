export interface IDocDepartment {
    _id: string;
    name: string;
    description: string;
 
}

export enum DocDepartmentModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}

export interface IDocDepartmentList extends Array<IDocDepartment>{}