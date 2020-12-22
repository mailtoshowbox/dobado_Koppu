import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './products.controller';
import { DocumentsService } from './products.service';
import { Documents, DocumentSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Documents.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
