import { Document } from 'mongoose';
export declare class Documents extends Document {
    name: string;
    qty: number;
    description: string;
    box: string;
    rack: string;
    category: string;
    qr_code: string;
}
export declare const DocumentSchema: import("mongoose").Schema<any>;
