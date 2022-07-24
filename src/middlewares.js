import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  //console.log(req.session.user);
  console.log(res.locals.loggedInUser);
  next();
};

export const protectorMiddleware = (req, res, next) => {
  req.session.loggedIn ? next() : res.redirect("/login");
};
export const publicOnlyMiddleware = (req, res, next) => {
  !req.session.loggedIn ? next() : res.redirect("/");
};

export const uploadAvatar = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
});
export const uploadVideo = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 300000000,
  },
});
