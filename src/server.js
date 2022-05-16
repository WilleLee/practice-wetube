import express from "express";

const PORT = 4000;

const app = express();

const handleHome = (req, res, next) => {
  console.log("home");
  return res.send("never mind");
};

app.get("/", handleHome);

// the browser never goes anywhere, but receives files that construct pages.

const handleListening = () =>
  console.log(`🥺 Server listening to the port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
