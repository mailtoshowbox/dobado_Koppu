import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocTypes extends Document {
  @Prop()
  name: string; 

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;
}

export const DocTypeSchema = SchemaFactory.createForClass(DocTypes);
