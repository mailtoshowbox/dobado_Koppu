import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string; 

  @Prop()
  id: string; 

  @Prop()
  roles: string[];

  @Prop()
  approved : boolean;

 
}

export const UserSchema = SchemaFactory.createForClass(User);

 