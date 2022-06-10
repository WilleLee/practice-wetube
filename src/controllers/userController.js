import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "cross-fetch";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Create Account" });
};
export const postJoin = async (req, res) => {
  const pageTitle = "Create Account";
  const { username, nickname, email, password, password2, location } = req.body;
  const alreadyExist = await User.exists({ $or: [{ nickname }, { email }] });
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation doesn't match!",
    });
  }
  if (alreadyExist) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This nickname/email is already being used.",
    });
  }
  try {
    await User.create({
      username,
      nickname,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) => {
  const pageTitle = "Login";
  return res.render("login", { pageTitle });
};
export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { nickname, password } = req.body;
  const user = await User.findOne({ nickname });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "This nickname does not exist.",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const targetUrl = `${baseUrl}?${params}`;
  return res.redirect(targetUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const targetUrl = `${baseUrl}?${params}`;
  const data = await fetch(targetUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();
  return res.send(JSON.stringify(json));
};
export const editUser = (req, res) => res.send("Edit User");
export const deleteUser = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("Log Out");
export const see = (req, res) => res.send("See");
