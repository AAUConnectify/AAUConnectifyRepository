import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



@Schema({ timestamps: true })
export class User {
  @Prop()
  studentId: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  email: string;
  
  @Prop()
  verificationCode: number;

  @Prop()
  verificationCodeExpiresAt: Date;

}


export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
