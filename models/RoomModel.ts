import { IUserModelDocument } from './UserModel';
import mongoose, { Document } from 'mongoose';

const { Schema } = mongoose;
//  author: IUserModelDocument['_id']; почему то только так работает первый раз такое
//   author: string; всегда раньше так работала
export interface IRoomModel {
  _id?: string;
  title: string;
  author: IUserModelDocument['_id'];
  messages: Array<MessageType> | [];
}

export type MessageType = {
  _id?: string;
  author: string;
  message: string;
};

export type IRoomModelDocument = IRoomModel & Document;

const RoomSchema = new Schema<IRoomModel>({
  title: {
    required: true,
    type: String,
  },
  author: {
    required: true,
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  messages: [
    {
      author: {
        required: true,
        ref: 'User',
        type: Schema.Types.ObjectId,
      },
      message: { required: true, type: String },
    },
  ],
});

const RoomModel = mongoose.model<IRoomModelDocument>('Room', RoomSchema);

export default RoomModel;
