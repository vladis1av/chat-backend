import express from 'express';
import { IUserModel } from './../models/UserModel';
import { IRoomModel } from './../models/RoomModel';
import { validationResult } from 'express-validator';
import { roomService } from '../services/RoomService';

class RoomController {
  async index(_: express.Request, res: express.Response): Promise<void> {
    try {
      const rooms = await roomService.getAllRooms();

      res.json({
        status: 'success',
        data: rooms,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error });
    }
  }

  async show(req: express.Request, res: express.Response): Promise<void> {
    try {
      const roomId = req.params.id;
      const room = await roomService.getRoomById(roomId);

      if (!room) {
        res.status(404).send();
        return;
      }

      res.json({
        status: 'success',
        data: room,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error });
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as IUserModel;

      if (user?._id) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({ status: 'error', errors: errors.array() });
        }

        const data: IRoomModel = {
          title: req.body.title,
          author: user._id,
          messages: [],
        };

        const room = await roomService.createRoom(data);

        res.json({
          status: 'success',
          data: room,
        });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', error: error });
    }
  }

  async sendMessage(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    try {
      const user = req.user as IUserModel;

      const message = req.body.message;
      const roomId = req.params.id;

      if (user?._id) {
        const data = {
          author: user._id,
          message,
        };

        const room = await roomService.sendMessage(roomId, data);

        if (room) {
          res.status(200).json({
            status: 'success',
          });
          return;
        } else {
          res.status(404).json({
            status: 'error',
          });
        }
      } else {
        res.status(404).json({
          status: 'error',
        });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', error: error });
    }
  }
}

export const RoomCtrl = new RoomController();
