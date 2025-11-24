import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import type { Profile, VerifyCallback } from "passport-google-oauth20";
import UserModal from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        let User = await UserModal.findOne({ googleId: profile.id });
        if (!User) {
          User = await UserModal.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            avatar: profile.photos?.[0]?.value,
          });
        }
        done(null, User);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        let User = await UserModal.findOne({ githubId: profile.id });
        if (!User) {
          User = await UserModal.create({
            githubId: profile.id,
            username: profile.username!,
            email: profile.emails?.[0]?.value || "",
            avatar: profile.photos?.[0]?.value,
          });
        }
        done(null, User);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

export default passport;
