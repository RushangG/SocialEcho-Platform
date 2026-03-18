const Community = require("../models/community.model");
const User = require("../models/user.model");
const Post = require("../models/post.model");

const escapeRegex = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const search = async (req, res) => {
  try {
    const searchQuery = (req.query.q || "").trim();
    const type = (req.query.type || "all").toLowerCase(); // 'user' | 'post' | 'community' | 'all'

    if (!searchQuery) {
      return res
        .status(200)
        .json({ posts: [], users: [], community: null, joinedCommunity: null });
    }

    const userId = req.userId;
    const communities = await Community.find({ members: userId }).distinct(
      "_id"
    );

    const safeQuery = escapeRegex(searchQuery);
    const startsWithRegex = new RegExp("^" + safeQuery, "i");
    const containsRegex = new RegExp(safeQuery, "i");

    const shouldSearchUsers = type === "user" || type === "all";
    const shouldSearchPosts = type === "post" || type === "all";
    const shouldSearchCommunities = type === "community" || type === "all";

    const [users, posts, joinedCommunity, community] = await Promise.all([
      shouldSearchUsers
        ? User.find({
            $or: [
              { name: { $regex: startsWithRegex } },
              { email: { $regex: startsWithRegex } },
            ],
          })
            .select("_id name email avatar")
            .limit(20)
            .lean()
        : Promise.resolve([]),
      shouldSearchPosts
        ? Post.find({
            community: { $in: communities },
            content: { $regex: containsRegex },
          })
            .select("_id content")
            .populate("user", "name avatar")
            .populate("community", "name")
            .limit(20)
            .lean()
            .exec()
        : Promise.resolve([]),
      shouldSearchCommunities
        ? Community.findOne({
            name: { $regex: startsWithRegex },
            members: { $in: userId },
          }).select("_id name description banner members")
        : Promise.resolve(null),
      shouldSearchCommunities
        ? Community.findOne({
            name: { $regex: startsWithRegex },
            members: { $nin: userId },
          }).select("_id name description banner members")
        : Promise.resolve(null),
    ]);

    posts.forEach((post) => {
      if (post.content && post.content.length > 30) {
        post.content = post.content.substring(0, 30) + "...";
      }
    });

    res.status(200).json({ posts, users, community, joinedCommunity });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = search;
