import { Document } from 'mongoose';
export declare class Documents extends Document {
    name: string;
    qty: number;
    description: string;
    box: string;
    rack: string;
    category: string;
    qr_code: string;
    manufacturedate: Date;
    expiredate: Date;
    type_of_space: string;
}
export declare const DocumentSchema: import("mongoose").Schema<any>;
