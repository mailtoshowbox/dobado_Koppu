import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocCategoryClass extends Document {
  @Prop()
  name: string; 

  @Prop()
  description: string;
}

export const DocCategorySchema = SchemaFactory.createForClass(DocCategoryClass);
