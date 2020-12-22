import { CreateDocumentDto } from './dto/create-product.dto';
import { Document } from './interfaces/product.interface';
import { DocumentsService } from './products.service';
export declare class DocumentsController {
    private readonly productsService;
    constructor(productsService: DocumentsService);
    findAll(): Promise<Document[]>;
    findOne(id: string): Promise<Document>;
    create(createProductDto: CreateDocumentDto): Promise<Document>;
    delete(id: string): Promise<Document>;
}
