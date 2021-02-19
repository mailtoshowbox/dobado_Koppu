import { Document } from 'mongoose';
export declare class Boxes extends Document {
    name: string;
    racks: number;
    description: string;
    isActive: boolean;
}
export declare const BoxSchema: import("mongoose").Schema<any>;
