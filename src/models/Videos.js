import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  title: { type: String, required: true, maxlength: 15 },
  description: { type: String, required: true, minlength: 8 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((hashtag) =>
      hashtag.startsWith("#") ? hashtag.trim() : `#${hashtag.trim()}`
    );
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
