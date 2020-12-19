import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BoxClass extends Document {
  @Prop()
  name: string;

  @Prop()
  racks: number;

  @Prop()
  description: string;
}

export const BoxSchema = SchemaFactory.createForClass(BoxClass);
