import { Document } from './interfaces/product.interface';
import { DocumentsService } from './products.service';
export declare class DocumentsController {
    private readonly productsService;
    constructor(productsService: DocumentsService);
    findAll(): Promise<Document[]>;
    findOne(id: string): Promise<import("./schemas/product.schema").Documents>;
    create(createProductDto: any): Promise<import("./schemas/product.schema").Documents>;
    delete(id: string): Promise<import("./schemas/product.schema").Documents>;
    getQRCode(generateQrCode: any): Promise<any>;
}
