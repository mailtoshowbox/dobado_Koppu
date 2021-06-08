import { Document } from 'mongoose';
export declare class CDocument extends Document {
    isActive: Boolean;
}
export declare class Retenstion extends Document {
    time: Number;
    defaultYear: Number;
    calculateNonPerceptualTime: String;
}
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
    document_info: CDocument;
    document_type: string;
    retension_time: Retenstion;
    isActive: boolean;
}
export declare const DocumentSchema: import("mongoose").Schema<Documents, import("mongoose").Model<any, any, any>, undefined>;
