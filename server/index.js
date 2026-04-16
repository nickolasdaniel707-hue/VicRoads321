import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// ✅ serve frontend files
app.use(express.static(path.join(__dirname, "server/public")));

// ✅ fallback to React app
app.get("*", (req, res) =>

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
