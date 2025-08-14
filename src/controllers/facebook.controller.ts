import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { config } from "../config/config";

// Extend express-session types to include 'user' property
import session from "express-session";
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
export const renderSignupPage = (req: Request, res: Response) => {
  res.render("pages/signup.ejs", {
    appId: config.facebook.appId,
    graphApiVersion: "v23.0", // Replace with the latest Graph API version
    configId: config.facebook.configId, // Add configId to your config file
    featureType: "", // Set to appropriate feature type (e.g., "only_waba_sharing")
  });
};
export const handleSignupCallback = async (req: Request, res: Response) => {
  console.log("handleSignupCallback called");
  const { code, phone_number_id, waba_id, business_id, error } = req.body;
  console.log(
    code,
    phone_number_id,
    waba_id,
    business_id,
    error,
    "in handleSignupCallback"
  );

  if (error) {
    console.error("Error in Embedded Signup:", error);
    return res.status(400).json({ message: "Embedded Signup failed", error });
  }

  if (code) {
    console.log("Received code:", code);
    // Example: Send the code to your server for token exchange
    try {
      req.session.user = { code, phone_number_id, waba_id, business_id };
      return res
        .status(200)
        .json({ message: "Signup successful", data: req.session.user });
    } catch (err) {
      console.error("Token exchange failed:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      return res
        .status(500)
        .json({ message: "Token exchange failed", error: errorMessage });
    }
  } else if (phone_number_id && waba_id && business_id) {
    // Handle successful flow completion (asset IDs returned)
    console.log("Received asset IDs:", {
      phone_number_id,
      waba_id,
      business_id,
    });
    // Store asset IDs in your database or session
    req.session.user = { phone_number_id, waba_id, business_id };
    return res
      .status(200)
      .json({ message: "Signup successful", data: req.session.user });
  } else {
    return res.status(400).json({ message: "Invalid callback data" });
  }
};
