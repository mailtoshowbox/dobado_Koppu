import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { RequestedDocumentService } from './requestedDocument.service';
import { RequestedDocuments, RequestedDocumentsSchema } from './schemas/requestedDocument.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestedDocuments.name, schema: RequestedDocumentsSchema },
    ]),
  ],
  controllers: [],
  providers: [RequestedDocumentService],
})
export class RequestedDocumentModule {}
