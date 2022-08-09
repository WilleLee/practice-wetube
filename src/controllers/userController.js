import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "cross-fetch";
import Video from "../models/Videos";

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
    req.flash("info", "successfully created an account");
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
  const user = await User.findOne({ nickname, socialOnly: false });
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
  req.flash("info", "successfully logged in");
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
  const tokenRequest = await (
    await fetch(targetUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        method: "GET",
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        method: "GET",
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(emailData);
    const email = emailData.find(
      (email) => email.primary && email.verified
    ).email;
    if (!email) {
      res.redirect("/login");
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: userData.name,
        nickname: userData.login,
        email,
        password: "",
        location: userData.location,
        socialOnly: true,
        avatarUrl: userData.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  req.flash("info", "Bye!");
  return res.redirect("/");
};
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { username, nickname, email, location },
    file,
  } = req;
  const currentUser = req.session.user;
  if (nickname !== currentUser.nickname) {
    const alreadyExist = await User.exists({ nickname });
    if (alreadyExist) return res.status(400).redirect("/users/edit");
  }
  if (email !== currentUser.email) {
    const alreadyExist = await User.exists({ email });
    if (alreadyExist) return res.status(400).redirect("/users/eidt");
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      username,
      nickname,
      email,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;

  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash(
      "error",
      "can't change the password b/c you're logged in by gitHub"
    );
    return res.redirect("/");
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok)
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "Wrong Password",
    });
  if (newPassword !== newPasswordConfirmation)
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "Wrong Confirmation",
    });

  const user = await User.findById(_id);
  console.log("hashed old password: ", user.password);
  user.password = newPassword;
  console.log("unhashed new password", user.password);
  await user.save();
  console.log("hashed new password", user.password);

  req.session.user.password = user.password;

  req.flash("info", "password updated");
  return res.redirect("/users/logout");
};

export const deleteUser = (req, res) => res.send("Delete User");

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user)
    return res.status(404).render("404", { pageTitle: "user not found" });
  return res.render("users/profile", {
    pageTitle: `${user.username}'s Profile`,
    user,
  });
};
