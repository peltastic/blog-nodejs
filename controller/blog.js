const moment = require("moment/moment");
const BlogModel = require("../model/blog");
const { calculateReadingTime } = require("../utils");

const getPublishedBlogs = async (req, res) => {
  const {
    page = 0,
    perpage = 20,
    tag,
    author,
    title,
    created_at,
    sortby = "created_at",
    sort = "asc",
  } = req.query;

  const findQueryObj = {};
  const sortQueryObj = {};
  const sortAttributes = sortby.split(" ");
  for (const attribute of sortAttributes) {
    if (sort === "asc" && sortby) {
      sortQueryObj[attribute] = 1;
    } else if (sort === "desc" && sortby) {
      sortQueryObj[attribute] = -1;
    }
  }
  if (created_at) {
    findQueryObj.created_at = {
      $gt: moment(created_at).startOf("day").toDate(),
      $lt: moment(created_at).endOf("day").toDate(),
    };
  }
  if (author) {
    findQueryObj.author = author;
  }
  if (tag) {
    findQueryObj.tag = { $in: tag.split(" ") };
  }
  if (title) {
    findQueryObj.title = title;
  }
  findQueryObj.state = "published";
  try {
    const blogs = await BlogModel.find(findQueryObj)
      .populate("author")
      .limit(perpage)
      .skip(perpage * page)
      .sort(sortQueryObj);
    return res.status(200).json({ success: true, data: blogs });
  } catch (e) {
    return res.status(500).send("Something went wrong");
  }
};

const getAPublishedBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await BlogModel.findOne({
    state: "published",
    _id: id,
  }).populate("author");

  await BlogModel.updateOne({ _id: id }, { read_count: blog.read_count + 1 });
  return res.status(200).json({ success: true, data: blog });
};

const createBlog = async (req, res) => {
  const body = req.body;
  try {
    const blog = await BlogModel.create({
      title: body.title,
      description: body.description,
      author: req.id,
      state: "draft",
      read_count: 0,
      reading_time: calculateReadingTime(body.body.length),
      tags: body.tags,
      body: body.body,
    });

    return res.status(201).json({ success: true, data: blog });
  } catch (err) {}
};

const publishBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const update = await BlogModel.updateOne(
      { _id: id },
      { state: "published" }
    );
    return res.status(200).json({ success: true, data: update });
  } catch (err) {}
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    await BlogModel.deleteOne({ _id: id });
    return res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err, message: "Something went wrong" });
  }
};

const getUserBlogs = async (req, res) => {
  const query = req.query;
  const perpage = query.perpage || 10;
  const page = Math.max(0, query.page || 0);
  let blogs;
  try {
    if (query.state) {
      blogs = await BlogModel.find({ state: query.state })
        .populate({
          path: "author",
          _id: req.id,
        })
        .limit(perpage)
        .skip(perpage * page);
    } else {
      blogs = await BlogModel.find({})
        .populate({
          path: "author",
          _id: req.id,
        })
        .limit(perpage)
        .skip(perpage * page);
    }
    return res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    return res
    .status(500)
    .json({ error: err, message: "Something went wrong" });
  }
};
module.exports = {
  createBlog,
  deleteBlog,
  getAPublishedBlog,
  getPublishedBlogs,
  getUserBlogs,
  publishBlog,
};
