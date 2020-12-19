import { Document } from 'mongoose';
export declare class BoxClass extends Document {
    name: string;
    racks: number;
    description: string;
}
export declare const BoxSchema: import("mongoose").Schema<any>;
