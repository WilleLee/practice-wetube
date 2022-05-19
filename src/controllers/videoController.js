export const trending = (req, res) => {
  const videos = [
    {
      title: "Video#1",
    },
    {
      title: "Video#2",
    },
  ];
  return res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const editVideo = (req, res) =>
  res.render("edit", { pageTitle: "Edit" });
export const deleteVideo = (req, res) => {
  return res.send(`Delete Video #${req.params.id}`);
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("upload");
