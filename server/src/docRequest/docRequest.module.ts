import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocRequestsController } from './docRequest.controller';
import { DocRequestService } from './docRequest.service';
import { DocRequests, DocRequestsSchema } from './schemas/docRequest.schema';
import { DocApprovalHistories, DocApprovalHistorySchema } from './schemas/docApprovalHistory.schema';
 

@Module({
  imports: [
    MongooseModule.forFeature([     
      { name: DocRequests.name, schema: DocRequestsSchema },    
      { name: DocApprovalHistories.name, schema: DocApprovalHistorySchema },
     ],),
  ],
  controllers: [DocRequestsController],
  providers: [DocRequestService, MongooseModule],
})
export class DocRequestModule {}
