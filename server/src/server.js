import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import session from "express-session";
import { createRequire } from "module";
import pool from "./config/db.js";
import router from "./router/index.routes.js";

const app = express();
const require = createRequire(import.meta.url);
const MySQLStore = require("express-mysql-session")(session);

const PORT = process.env.PORT || process.env.LOCAL_PORT;

// Configurer CORS
app.use(
  cors({
    origin: "http://localhost:9500", // Remplacez par l'origine de votre client
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Configurer les sessions
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
    },
  })
);

// Envoi de réponses JSON
app.use(express.json({ limit: "10mb" })); // Augmente la limite à 10 Mo

app.use(express.static(path.join(process.cwd(), "public")));

// Formulaires
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// Middleware pour gérer les sessions
app.use(async (req, res, next) => {
  console.log("user session", req.session.user);
  try {
    const [[result]] = await pool.query(
      "SELECT COUNT(session_id) AS session FROM sessions"
    );

    console.log("Active sessions:", result.session);
    console.log(
      "User session:",
      req.session.user ? req.session : "No user session"
    );
  } catch (err) {
    console.error("Error fetching sessions:", err.message);
  }
  next();
});

app.use(["/api/v1", "/"], router);

const domain =
  process.env.NODE_ENV === "3wa_cloud"
    ? `reisfonseca.ide.3wa.io:${PORT}`
    : `localhost:${PORT}`;
app.listen(PORT, () => {
  console.log(`Server is running at http://${domain}`);
});
