// File: announcement/announcement.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnnouncementDocument = Announcement & Document;

@Schema()
export class Announcement {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop() 
  annProfile: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  likes?: Types.ObjectId[];



  
  
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
