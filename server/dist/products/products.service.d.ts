import { Model } from 'mongoose';
import { Document } from './interfaces/product.interface';
import { Documents } from './schemas/product.schema';
import { Boxes } from './schemas/box.schema';
import { Racks } from './schemas/rack.schema';
export declare class DocumentsService {
    private productModel;
    private readonly boxModel;
    private readonly rackModel;
    constructor(productModel: Model<Documents>, boxModel: Model<Boxes>, rackModel: Model<Racks>);
    findAll(): Promise<Document[]>;
    findAllDocuments(): Promise<Documents[]>;
    getDashboardList(id: string): Promise<Documents>;
    findOne(id: string): Promise<Documents>;
    create(product: Document): Promise<Documents>;
    delete(id: string): Promise<Documents>;
    update(id: string, product: Document): Promise<Documents>;
    getQRCode(qrData: any): Promise<any>;
    getRandomCode(dat: any): Promise<{
        code: string;
    }>;
    runAsyncFunctions(qrData: any): Promise<any>;
}
