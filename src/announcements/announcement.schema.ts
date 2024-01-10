// announcement.schema.ts
import * as mongoose from 'mongoose';

export const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
  },
  content: {
    type: String,
    minlength: 10,
    required: true,
  },
  reactions: {
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  announcementPicture: {
    type: String,
    default: null,
    required: false,
  },
});

export interface Announcement extends mongoose.Document {
  title: string;
  content: string;
  reactions: {
    likes: mongoose.Types.ObjectId[];
  };
  createdAt: Date;
  announcementPicture: string | null;
}
