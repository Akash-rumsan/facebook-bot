import express from "express";
import bodyParser from "body-parser";
import webhookRoutes from "./routes/webhook.routes";
import session from "express-session";
import passport from "passport";
import facebookRoutes from "./routes/facebook.routes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: "my_secret_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.use(express.static("public"));

// app.use("/webhook", webhookRoutes);

app.use("/", facebookRoutes);
app.get("/", (_, res) => {
  res.render("pages/index.ejs");
});

export default app;
