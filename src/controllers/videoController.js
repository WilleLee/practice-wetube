import Video from "../models/Videos";
import User from "../models/User";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "descending" });
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id).populate("owner");
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
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      fileUrl,
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
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
