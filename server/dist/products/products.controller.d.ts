import { Document } from './interfaces/product.interface';
import { DocumentsService } from './products.service';
import { BoxService } from '../box/box.service';
export declare class DocumentsController {
    private readonly productsService;
    private readonly boxService;
    constructor(productsService: DocumentsService, boxService: BoxService);
    getDashboardList(loginUser: string): Promise<{}>;
    findAll(): Promise<Document[]>;
    findOne(id: string): Promise<import("./schemas/product.schema").Documents>;
    create(createProductDto: any): Promise<import("./schemas/product.schema").Documents>;
    delete(id: string): Promise<import("./schemas/product.schema").Documents>;
    getQRCode(generateQrCode: any): Promise<{
        code: string;
    }>;
    getRandomCode(generateQrCode: any): Promise<{
        code: string;
    }>;
    update(id: string, updateProductDto: any): Promise<import("./schemas/product.schema").Documents>;
}
