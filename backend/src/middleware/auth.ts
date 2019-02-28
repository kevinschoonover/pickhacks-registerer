import * as passport from "koa-passport";

import { OAuth2Strategy as googleStrategy } from "passport-google-oauth";
import { Strategy as BearerStrategy } from "passport-http-bearer";

import { config } from "../config";
import { Account } from "../entity/Account";

passport.serializeUser((user: Account, done: any) => {
  done(undefined, user.id);
});

passport.deserializeUser(async (userID: number, done: any) => {
  const user = await Account.findOne({id: userID}, {relations: ["permissions"]});
  if (user) {
    done(undefined, user);
  } else {
    done(undefined, false);
  }
});

export { passport };
