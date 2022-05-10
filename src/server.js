import express from "express";

const PORT = 4000;

const app = express();

const handleHome = (req, res) => {
  return res.send("<h1>love you</h1>");
};
const handleSignin = (req, res) => {
  return res.send("You're signed in.");
};

app.get("/", handleHome);
app.get("/signin", handleSignin);

const handleListening = () =>
  console.log(`🥺 Server listening to the port ${PORT}`);

app.listen(PORT, handleListening);
