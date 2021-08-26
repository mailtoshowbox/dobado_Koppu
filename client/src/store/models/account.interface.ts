export interface IAccount {
    name: string;
    email: string; 
    emp_id: string; 
    roles:Array<string> ;
    auth:any;
    isAllowedForApproval: boolean,
    departments:any
} 