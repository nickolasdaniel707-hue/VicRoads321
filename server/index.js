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

mongoose.connect(process.env.MONGO_URI);

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
  const stream = cloudinary.uploader.upload_stream(
    { resource_type: "image" },
    (err, result) => {
      if (err) return res.status(500).send(err);
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

app.listen(5000, () => console.log("Server running"));
