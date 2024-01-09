import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Student {
  @Prop()
  studentId: string;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export type StudentDocument = Student & Document;
export const StudentSchema = SchemaFactory.createForClass(Student);