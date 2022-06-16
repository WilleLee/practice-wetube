export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  req.session.loggedIn ? next() : res.redirect("/login");
};
export const publicOnlyMiddleware = (req, res, next) => {
  !req.session.loggedIn ? next() : res.redirect("/");
};
