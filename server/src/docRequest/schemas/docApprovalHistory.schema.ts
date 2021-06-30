import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';




@Schema()
export class DocApprovalHistories extends Document {


  @Prop()
  request_no: string;

  @Prop()
  updated_by: string; 

  @Prop()
  updated_on: Date; 

  @Prop()
  history: string;

  @Prop()
  mode_of_access: string;

  @Prop()
  page_from: string;
 
 
}

export const DocApprovalHistorySchema = SchemaFactory.createForClass(DocApprovalHistories);

