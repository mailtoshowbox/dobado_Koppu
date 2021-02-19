import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocCategories extends Document {
  @Prop()
  name: string; 

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;
}

export const DocCategorySchema = SchemaFactory.createForClass(DocCategories);
