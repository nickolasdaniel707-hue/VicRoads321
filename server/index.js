import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// Model
const User = mongoose.model("User", {
  profilePhoto: String,
  licensePhoto: String,
  idPhoto: String,
});

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Upload
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).send("No file");

  const stream = cloudinary.uploader.upload_stream(
    { resource_type: "image" },
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ url: result.secure_url });
    }
  );

  stream.end(req.file.buffer);
});

// Save
app.post("/save", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// FIXED PATH
const __dirname = path.resolve();

// Serve frontend
app.use(express.static(path.join(__dirname, "server/public")));

// Fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "server/public/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
