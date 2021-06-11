import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class RequestedDocuments extends Document {
  @Prop()
  document_name: string;

  @Prop()
  document_no: string;

  @Prop()
  no_of_copy: number;

  @Prop()
  no_of_page: number;

  @Prop()
  isActive: boolean;

  @Prop()
  request_id: string;


  @Prop()
  reason_for_request: string;
  
}

export class documentApproval extends Document {
  @Prop()
  isApproved: boolean;

  @Prop()
  approvedBy: string;

  @Prop()
  isRejected: boolean;

  @Prop()
  rejectedBy: string;

  @Prop()
  approvedOn: Date;
}



export const RequestedDocumentsSchema = SchemaFactory.createForClass(RequestedDocuments);
