import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocRequestsController } from './docRequest.controller';
import { DocRequestService } from './docRequest.service';
import { DocRequests, DocRequestsSchema } from './schemas/docRequest.schema';
import { DocApprovalHistories, DocApprovalHistorySchema } from './schemas/docApprovalHistory.schema';
import { Documents, DocumentSchema } from '../products/schemas/product.schema';
 

@Module({
  imports: [
    MongooseModule.forFeature([     
      { name: DocRequests.name, schema: DocRequestsSchema },    
      { name: DocApprovalHistories.name, schema: DocApprovalHistorySchema },
      { name: Documents.name, schema: DocumentSchema },
     ],),
  ],
  controllers: [DocRequestsController],
  providers: [DocRequestService, MongooseModule],
})
export class DocRequestModule {}
