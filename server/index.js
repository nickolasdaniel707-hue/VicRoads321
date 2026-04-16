import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// serve static files
app.use(express.static(path.join(__dirname, "server/public")));

// fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "server/public/index.html"));
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
