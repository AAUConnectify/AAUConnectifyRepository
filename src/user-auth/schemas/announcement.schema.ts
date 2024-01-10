// announcement.schema.ts

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Announcement {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  // Add any other properties you might need for your Announcement model

}

export type AnnouncementDocument = Announcement & Document;
export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
