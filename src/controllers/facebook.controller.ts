import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { config } from "../config/config";

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done: (err: any, user?: any) => void) => {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook.appId,
      clientSecret: config.facebook.appSecret,
      callbackURL: config.facebook.callbackURL,
      profileFields: ["id", "displayName", "emails"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

export const facebookAuth = passport.authenticate("facebook", {
  scope: ["public_profile", "email"],
});

export const facebookCallback = [
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    res.redirect("/profile");
  },
];

export const getProfile = (req: Request, res: Response) => {
  console.log("get profile", req.isAuthenticated());

  if (req.isAuthenticated()) {
    console.log(req.user);
    // res.json({ message: `Hello, ${req.user.displayName}!`, user: req.user });
    res.render("pages/profile.ejs", {
      user: req.user,
    });
  } else {
    res.redirect("/");
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
