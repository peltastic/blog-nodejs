const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  state: {
    type: String,
    enum: ["draft", "published"],
  },
  read_count: {
    type: Number,
  },
  reading_time: {
    type: Number,
  },
  tags: [{ type: String }],
  body: {
    type: String,
    required: true,
  },
  created_at: { type: Date, required: true, default: Date.now },
});

const BlogModel = mongoose.model("Blog", blogSchema);

module.exports = BlogModel;
