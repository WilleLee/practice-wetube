import express from "express";
import morgan from "morgan";
/*routers*/
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", globalRouter);

// the browser never goes anywhere, but receives files that construct pages.

const handleListening = () =>
  console.log(`🥺 Server listening to the port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
