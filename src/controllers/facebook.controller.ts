import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { config } from "../config/config";
import sqlite3 from "sqlite3";

// Extend express-session types to include 'user' property
import axios from "axios";
declare module "express-session" {
  interface SessionData {
    user?: {
      code?: string;
      phone_number_id?: string;
      waba_id?: string;
      business_id?: string;
    };
  }
}

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
      console.log(accessToken, "access token");
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
    // console.log(req, "req in facebook call back");
    res.redirect("/profile");
  },
];

export const getProfile = (req: Request, res: Response) => {
  console.log("get profile", req.isAuthenticated());

  if (req.isAuthenticated()) {
    // console.log(req, "req in getProgile");
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

const db = new sqlite3.Database("db/credentials.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    // Create table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        access_token TEXT NOT NULL,
        waba_id TEXT NOT NULL,
        phone_number_id TEXT NOT NULL,
        business_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

async function exchangeCodeForToken(code: string) {
  const response = await axios.post(
    "https://graph.facebook.com/v23.0/oauth/access_token",
    {
      client_id: config.facebook.appId,
      client_secret: config.facebook.appSecret,
      redirect_uri: config.facebook.callbackURL,
      code,
    }
  );
  return response.data;
}

export const renderSignupPage = (req: Request, res: Response) => {
  res.render("pages/signup.ejs", {
    appId: config.facebook.appId,
    graphApiVersion: "v23.0",
    configId: config.facebook.configId,
    featureType: "",
  });
};
export const handleSignupCallback = async (req: Request, res: Response) => {
  const { code, phone_number_id, waba_id, business_id, error } = req.body;
  console.log(req.body, "req.body");
  console.log(
    code,
    phone_number_id,
    waba_id,
    business_id,
    error,
    "checking from req.body"
  );

  if (error) {
    console.error("Error in Embedded Signup:", error);
    return res.status(400).json({ message: "Embedded Signup failed", error });
  }
  let accessToken: string | undefined;

  try {
    if (code) {
      // Exchange code for access token
      const tokenData = await exchangeCodeForToken(code);
      console.log(tokenData, "token data");
      accessToken = tokenData.access_token;
      console.log("Access Token:", accessToken);
    }
    if (phone_number_id && waba_id && business_id) {
      // Store credentials in the database
      db.run(
        `INSERT INTO credentials (access_token, waba_id, phone_id, business_id) VALUES (?, ?, ?, ?)`,
        [accessToken, waba_id, phone_number_id, business_id],
        function (err) {
          if (err) {
            console.error("Error inserting credentials:", err.message);
            return res
              .status(500)
              .json({ message: "Database error", error: err.message });
          }
          console.log("Credentials stored successfully with ID:", this.lastID);
          req.session.user = { phone_number_id, waba_id, business_id };
          return res
            .status(200)
            .json({ message: "Signup successful", data: req.session.user });
        }
      );
    } else {
      return res.status(400).json({ message: "Invalid callback data" });
    }
  } catch (err) {
    console.error("Error handling signup callback:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return res
      .status(500)
      .json({ message: "Signup failed", error: errorMessage });
  }
};
