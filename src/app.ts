import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import facebookRoutes from "./routes/facebook.routes";
import db from "./utils/db";

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

// Example endpoint to add credentials
app.post("/credentials", (req, res) => {
  const { access_token, waba_id, phone_id, business_id } = req.body;
  const sql = `
    INSERT INTO credentials (access_token, waba_id, phone_id, business_id)
    VALUES (?, ?, ?, ?)
  `;
  db.run(sql, [access_token, waba_id, phone_id, business_id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: "Credentials added successfully" });
  });
});

// Example endpoint to list students
app.get("/credentials", (_, res) => {
  db.all("SELECT * FROM credentials", [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.delete("/credentials/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM credentials WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "No record found with that ID" });
    }

    res.json({ message: "Record deleted successfully", deletedId: id });
  });
});
