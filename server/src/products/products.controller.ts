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
import { BoxService } from '../box/box.service';
import { DocCategoryService } from '../docCategory/docCategory.service';
import { UsersService } from '../users/users.service';
import { DocTypeService } from '../docType/docType.service';
import { promises } from 'dns';
import { resolve } from 'path';

@Controller('products')
export class DocumentsController {
  constructor(
    private readonly productsService: DocumentsService, 
     private readonly boxService: BoxService
     
     ) {}


  @Get('dashboard/:loginUser')
  getDashboardList(@Param('loginUser') loginUser: string)  {
    let dashboardItems = {};
    const pS =   this.productsService.findAllDocuments();     
    const bS =   this.boxService.findAll();
    return Promise.all([pS, bS]).then(([docs, boxes]) => { 
      dashboardItems['documents'] = {data :  docs, status:'Success'}
      dashboardItems['box'] = {data :  boxes, status:'Success'} 
      return dashboardItems;
    }).catch((error)=>{
      dashboardItems['documents'] = {data :  [], status:'Failed'+error}
      dashboardItems['box'] = {data :  [], status:'Failed'} 
      return dashboardItems;
    });
  }


  @Get(':modes/:id')
  findAll(  @Param('modes') modes: string, @Param('id') id: string ): Promise<Document[]> {

    if(modes && modes === "issued" ){
      let res = this.productsService.findAll(modes, id).then((succ=[])=>{   
        let onfo =  succ.map((doc : any)=>{ 
   
           const {box_info=[], rack_info=[], category_info =[], docType_info=[] } = doc;
           if(box_info.length > 0){
             doc.box= box_info[0].name;
           }
           if(box_info.length > 0){
             doc.rack= rack_info[0].name;
           }
           if(box_info.length > 0){
             doc.category= category_info[0].name;
           }
           if(docType_info.length > 0){
             doc.document_type= docType_info[0].name;
           }
   
   
           doc.batch = doc.category+'/'+doc.box+'/'+doc.rack
           delete doc.box_info;
           delete doc.rack_info;
           delete doc.category_info;
           delete doc.docType_info; 
           
          return doc;
         }) 
         return onfo;
       });
       return res;
    } if(modes && modes === "takeOutRequest" ){
      let res = this.productsService.findAll(modes, id);
       return res;
    }else{
      let res = this.productsService.findAll(modes).then((succ=[])=>{   
        let onfo =  succ.map((doc : any)=>{ 
   
           const {box_info=[], rack_info=[], category_info =[], docType_info=[] } = doc;
           if(box_info.length > 0){
             doc.box= box_info[0].name;
           }
           if(box_info.length > 0){
             doc.rack= rack_info[0].name;
           }
           if(box_info.length > 0){
             doc.category= category_info[0].name;
           }
           if(docType_info.length > 0){
             doc.document_type= docType_info[0].name;
           }
   
   
           doc.batch = doc.category+'/'+doc.box+'/'+doc.rack
           delete doc.box_info;
           delete doc.rack_info;
           delete doc.category_info;
           delete doc.docType_info; 
           
          return doc;
         }) 
         return onfo;
       });
       return res;
    }
    
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

  @Post(":mode")
  logSheets(@Body() params ): Promise<Document[]> {

      let res = this.productsService.getLogSheet(params).then((succ=[])=>{   
        let onfo =  succ.map((doc : any)=>{ 
   
           const {box_info=[], rack_info=[], category_info =[], docType_info=[] } = doc;
           if(box_info.length > 0){
             doc.box= box_info[0].name;
           }
           if(box_info.length > 0){
             doc.rack= rack_info[0].name;
           }
           if(box_info.length > 0){
             doc.category= category_info[0].name;
           }
           if(docType_info.length > 0){
             doc.document_type= docType_info[0].name;
           }
   
   
           doc.batch = doc.category+'/'+doc.box+'/'+doc.rack
           delete doc.box_info;
           delete doc.rack_info;
           delete doc.category_info;
           delete doc.docType_info; 
           
          return doc;
         }) 
         return onfo;
       });
       return res;
    
    
  }
/* 
  @Post(':getQRCode')
  getQRCode(@Body() generateQrCode)  {
    
    return this.productsService.getRandomCode(generateQrCode);
  }
*/
  
  @Post('qrcode/:getRandomCode')
  getRandomCode(@Body() generateQrCode)  {
    console.log("generateQrCode---", generateQrCode)
 
    return this.productsService.getRandomCode(generateQrCode);
  } 

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto,
  ) { 
    return this.productsService.update(id, updateProductDto);
  } 
}
