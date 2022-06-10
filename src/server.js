import express from "express";
import morgan from "morgan";
import session from "express-session";
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";
/*routers*/
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("x-powered-by", false);
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 20000,
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", rootRouter);

// the browser never goes anywhere, but receives files that construct pages.

export default app;
