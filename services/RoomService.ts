import { IRoomModel, IRoomModelDocument } from './../models/RoomModel';
import RoomModel from '../models/RoomModel';

interface IMessage {
  author: string;
  message: string;
}

class RoomService {
  async getAllRooms() {
    const rooms = await RoomModel.find({}).exec();
    return rooms;
  }
  async getRoomById(id: string) {
    const room = await RoomModel.findById(id).exec();
    return room;
  }
  async createRoom(data: IRoomModel): Promise<IRoomModelDocument> {
    const room = await RoomModel.create(data);
    return room;
  }

  async sendMessage(
    roomId: string,
    data: IMessage,
  ): Promise<IRoomModelDocument> {
    const room = await RoomModel.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { messages: data } },
    );
    return room;
  }
}

export const roomService = new RoomService();
