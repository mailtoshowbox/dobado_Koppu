import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class CDocument extends Document {
  @Prop()
  isActive: Boolean;
}
export class Retenstion extends Document {
  @Prop()
  time: Number;
  @Prop()
  defaultYear: Number;
  @Prop()
  calculateNonPerceptualTime: String; 
}
@Schema()
export class Documents extends Document {
  @Prop()
  name: string;

  @Prop()
  qty: number;

  @Prop()
  description: string;

  @Prop()
  box: string;

  @Prop()
  rack: string;

  @Prop()
  category: string;

  @Prop()
  qr_code: string;

  @Prop()
  manufacturedate: Date;

  @Prop()
  expiredate: Date;

  @Prop()
  type_of_space: string;

  @Prop()
  document_info: CDocument;

  @Prop()
  document_type: string;

  @Prop()
  retension_time: Retenstion;

  @Prop()
  isActive: boolean;

  @Prop()
  isRequestedDocument: boolean;

  @Prop()
  document_no: string;

  @Prop()
  no_of_copy: number;

  @Prop()
  no_of_page: number;
  
}





export const DocumentSchema = SchemaFactory.createForClass(Documents);
