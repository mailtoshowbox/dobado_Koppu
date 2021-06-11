import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocRequestsController } from './docRequest.controller';
import { DocRequestService } from './docRequest.service';
import { DocRequests, DocRequestsSchema } from './schemas/docRequest.schema';
 

@Module({
  imports: [
    MongooseModule.forFeature([
   //   { name: RequestedDocuments.name, schema: RequestedDocumentsSchema },
      { name: DocRequests.name, schema: DocRequestsSchema },    
 
    ],),
  ],
  controllers: [DocRequestsController],
  providers: [DocRequestService, MongooseModule],
})
export class DocRequestModule {}
