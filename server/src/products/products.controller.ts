import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-product.dto';
import { Document } from './interfaces/product.interface';
import { DocumentsService } from './products.service';

@Controller('products')
export class DocumentsController {
  constructor(private readonly productsService: DocumentsService) {}

  @Get()
  findAll(): Promise<Document[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Document> {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() createProductDto: CreateDocumentDto): Promise<Document> {



    return this.productsService.create(createProductDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Document> {
    return this.productsService.delete(id);
  }

/*   @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  } */
}
