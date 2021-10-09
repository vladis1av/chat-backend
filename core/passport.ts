import { userService } from './../services/UserService';
import { generateMD5 } from './../utils/generateHash';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';

import UserModel from '../models/UserModel';

passport.use(
  new LocalStrategy(async (username, password, done): Promise<void> => {
    try {
      const user = await userService.getUserByUsername(username);

      if (!user) {
        return done(null, false);
      }

      if (
        user.password ===
        generateMD5(password + process.env.SECRET_KEY || '3Da414asF')
      ) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, false);
    }
  }),
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY || '3Da414asF',
      jwtFromRequest: ExtractJwt.fromHeader('token'),
    },
    async (payload, done) => {
      try {
        const user = await userService.getUserById(payload.data._id);

        if (user) {
          return done(null, user);
        }
        done(null, false);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err: any, user: any) => {
    done(err, user);
  });
});

export { passport };
