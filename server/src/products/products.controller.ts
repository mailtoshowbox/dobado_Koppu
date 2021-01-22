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
    let res = this.productsService.findAll().then((succ=[])=>{   
     let onfo =  succ.map((doc)=>{
        const {box_info=[], rack_info=[], category_info =[] } = doc;
        if(box_info.length > 0){
          doc.box= box_info[0].name;
        }
        if(box_info.length > 0){
          doc.rack= rack_info[0].name;
        }
        if(box_info.length > 0){
          doc.category= category_info[0].name;
        }
        delete doc.box_info;
        delete doc.rack_info;
        delete doc.category_info;
       return doc;
      })
      return onfo;
    });
    return res;
  }

  @Get(':id')
  findOne(@Param('id') id: string)  {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() createProductDto)  {
    return this.productsService.create(createProductDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string)  {
    return this.productsService.delete(id);
  }

  @Post(':getQRCode')
  getQRCode(@Body() generateQrCode)  {
    return this.productsService.getQRCode(generateQrCode);
  }

/*   @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  } */
}
