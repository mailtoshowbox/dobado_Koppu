import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './products.controller';
import { DocumentsService } from './products.service';
import { Documents, DocumentSchema } from './schemas/product.schema';
import { BoxModule } from '../box/box.module';
import { DocTypeModule } from '../docType/docType.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Documents.name, schema: DocumentSchema } ,  
         
    ],) ,BoxModule,DocTypeModule
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService] 
})
export class DocumentsModule {}
