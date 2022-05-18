export const trending = (req, res) => res.render("home");
export const see = (req, res) => res.render("watch");
export const editVideo = (req, res) => res.render("edit");
export const deleteVideo = (req, res) => {
  return res.send(`Delete Video #${req.params.id}`);
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("upload");
