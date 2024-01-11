
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole } from './user-role.enum';

@Schema({ timestamps: true })
export class User {
  
  @Prop()
  studentId: string;
  @Prop()
  password: string;

  @Prop()  
  username: string;

  @Prop()
  securityQuestion: string;


  @Prop({ type: String, enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Prop()
  userpassword: string;

  @Prop()
  profilePic: string;

  @Prop()
  fieldOfStudy: string;

  @Prop()
  fullName: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
