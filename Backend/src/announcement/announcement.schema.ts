// src/announcements/schemas/announcement.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Announcement extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  // Add any other fields you need for announcements
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
