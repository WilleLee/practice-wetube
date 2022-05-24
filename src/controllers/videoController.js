export const trending = (req, res) => {
  const videos = [
    {
      title: "Video#1",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      vies: 59,
      id: 1,
    },
    {
      title: "Video#2",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      vies: 59,
      id: 1,
    },
    {
      title: "Video#3",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      vies: 59,
      id: 1,
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
