import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocType extends Document {
  @Prop()
  name: string; 

  @Prop()
  description: string; 
}

export const DocTypeSchema = SchemaFactory.createForClass(DocType);
