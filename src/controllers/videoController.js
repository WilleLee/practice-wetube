export const trending = (req, res) => res.send("Home Page Videos");
export const see = (req, res) => {
  return res.send(`<h1>Watch Video #${req.params.id}</h1>`);
};
export const editVideo = (req, res) => {
  return res.send(`Edit Video #${req.params.id}`);
};
export const deleteVideo = (req, res) => {
  return res.send(`Delete Video #${req.params.id}`);
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("upload");
