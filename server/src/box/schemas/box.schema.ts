import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Boxes extends Document {
  @Prop()
  name: string;

  @Prop()
  racks: number;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;
}

export const BoxSchema = SchemaFactory.createForClass(Boxes);
