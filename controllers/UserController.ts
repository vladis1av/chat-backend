import express from 'express';
import jwt from 'jsonwebtoken';
import { IUserModelDocument } from './../models/UserModel';
import { generateMD5 } from './../utils/generateHash';
import { validationResult } from 'express-validator';
import { userService } from '../services/UserService';

class UserController {
  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ status: 'error', errors: errors.array() });
        return;
      }

      const data = {
        username: req.body.username,
        fullName: req.body.fullName,
        password: generateMD5(
          req.body.password + process.env.SECRET_KEY || '3Da414asF',
        ),
      };

      const user = await userService.userCreate(data);

      res.json({ status: 'success', data: user });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error });
    }
  }

  async login(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user
        ? (req.user as IUserModelDocument).toJSON()
        : undefined;
      res.json({
        status: 'success',
        data: {
          ...user,
          token: jwt.sign(
            { data: user },
            process.env.SECRET_KEY || '3Da414asF',
            { expiresIn: '30 days' },
          ),
        },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error });
    }
  }

  async getMe(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user
        ? (req.user as IUserModelDocument).toJSON()
        : undefined;
      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error });
    }
  }
}

export const UserCtrl = new UserController();
