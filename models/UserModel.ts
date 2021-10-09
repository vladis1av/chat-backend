import mongoose, { Document } from 'mongoose';

const { Schema } = mongoose;

export interface IUserModel {
  _id?: string;
  username: string;
  fullName: string;
  password: string;
}

export type IUserModelDocument = IUserModel & Document;

const UserSchema = new Schema<IUserModel>({
  username: {
    unique: true,
    required: true,
    type: String,
  },
  fullName: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

UserSchema.set('toJSON', {
  transform: function (_, obj) {
    delete obj.password;
  },
});

const UserModel = mongoose.model<IUserModelDocument>('User', UserSchema);

export default UserModel;
