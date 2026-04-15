import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const User = mongoose.model("User", {
  profilePhoto: String,
  licensePhoto: String,
  idPhoto: String,
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("image"), (req, res) => {
  console.log("Upload request received");

  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).send("No file uploaded");
  }

  const stream = cloudinary.uploader.upload_stream(
    { resource_type: "image" },
    (err, result) => {
      if (err) {
        console.log("UPLOAD ERROR:", err);
        return res.status(500).send(err);
      }

      console.log("UPLOAD SUCCESS:", result.secure_url);
      res.json({ url: result.secure_url });
    }
  );

  stream.end(req.file.buffer);
});

app.post("/save", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

import path from "path";

const __dirname = new URL('.', import.meta.url).pathname;

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
