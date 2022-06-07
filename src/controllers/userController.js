import User from "../models/User";
import bcrypt from "bcrypt";

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
  console.log("User logged in!");
  return res.redirect("/");
};
export const editUser = (req, res) => res.send("Edit User");
export const deleteUser = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("Log Out");
export const see = (req, res) => res.send("See");
