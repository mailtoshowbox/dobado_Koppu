import { Model } from 'mongoose';
import { Document } from './interfaces/product.interface';
import { Documents } from './schemas/product.schema';
export declare class DocumentsService {
    private productModel;
    constructor(productModel: Model<Documents>);
    findAll(): Promise<Document[]>;
    findOne(id: string): Promise<Document>;
    create(product: Document): Promise<Document>;
    delete(id: string): Promise<Document>;
    update(id: string, product: Document): Promise<Document>;
}
