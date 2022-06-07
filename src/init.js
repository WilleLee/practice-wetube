import "./db";
import "./models/Videos";
import "./models/User";
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`🥺 Server listening to the port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
