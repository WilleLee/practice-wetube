import Video from "../models/Videos";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "descending" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id)
      .populate("owner")
      .populate("comments");
    console.log(video);
    //console.log(owner);
    return res.render("watch", { pageTitle: video.title, video });
  } catch (error) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    const {
      user: { _id },
    } = req.session;
    if (String(video.owner) !== String(_id))
      return res.status(403).redirect("/");
    return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
  } catch (error) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
  } catch (error) {
    res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  console.log(req.files);
  const { video, thumbnail } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      fileUrl: video[0].path,
      thumbnailUrl: thumbnail[0].path,
      title,
      description,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMsg: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    const {
      user: { _id },
    } = req.session;
    if (String(video.owner) !== String(_id))
      return res.status(403).redirect("/");
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
  } catch (error) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) return res.sendStatus(404);
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);

  if (!video) return res.sendStatus(404);
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();

  return res.status(201).json({ newCommentId: comment._id });
};
export const deleteComment = async (req, res) => {
  const {
    params: { id },
  } = req;
  const {
    user: { _id },
  } = req.session;
  const comment = await Comment.findById(id);
  if (String(comment.owner) !== String(_id)) {
    req.flash("error", "you can't remove comments that are not yours");
    return res.sendStatus(404);
  }
  try {
    await Comment.findByIdAndDelete(id);
    return res.sendStatus(200);
  } catch (err) {
    req.flash("error", err._message);
    return res.sendStatus(404);
  }
};
