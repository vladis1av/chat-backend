import { IUserModel } from './../models/UserModel';
import UserModel, { IUserModelDocument } from '../models/UserModel';

class UserService {
  async userCreate(data: IUserModel): Promise<IUserModelDocument> {
    const user = await UserModel.create(data);
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await UserModel.findOne({ username }).exec();
    return user;
  }

  async getUserById(id: string) {
    const user = await UserModel.findById(id).exec();
    return user;
  }
}

export const userService = new UserService();
