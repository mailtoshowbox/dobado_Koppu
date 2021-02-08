import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const DocumentSchema = SchemaFactory.createForClass(Documents);
