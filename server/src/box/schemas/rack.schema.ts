import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RackClass extends Document {
  @Prop()
  name: string; 

  @Prop()
  status: string;
  
  @Prop()
  box: string; 

  @Prop()
  picked: boolean; 
}

export const RackSchema = SchemaFactory.createForClass(RackClass);
