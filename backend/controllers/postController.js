const Post = require("../models/Post");
const Group = require("../models/Group");

const createPost = async (req, res) => {
  const { title, description, location, image } = req.body;
  const userId = req.user.id; // Get user ID from JWT session

  if (!title || !description || !location) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // ✅ Step 1: Create the Post first (without `groupId`)
    const post = new Post({
      title,
      description,
      location,
      image,
      createdBy: userId,
      members: [userId], // Post creator is automatically a member
    });

    await post.save(); // Save the post first to get `_id`

    // ✅ Step 2: Now create the Group using the Post's `_id`
    const group = new Group({
      postId: post._id, // ✅ Use the created post's ID
      groupName: `${title} - Trekking Group`,
      members: [userId],
      admin: userId,
    });

    await group.save(); // Save the group

    // ✅ Step 3: Update the Post with the correct `groupId`
    post.groupId = group._id;
    await post.save(); // Save post again with updated `groupId`

    res.status(201).json({ message: "Post created successfully", post, group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const joinPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is already a member
    if (post.members.includes(userId)) {
      return res.status(400).json({ error: "You are already in this group" });
    }

    // Add user to post members
    post.members.push(userId);
    await post.save();

    // Add user to group members
    const group = await Group.findById(post.groupId);
    if (group) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json({ message: "Joined post successfully", groupId: group._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("createdBy", "name email").populate("groupId");
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ DELETE Post (Admin Only)
const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.createdBy.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized: Only the post creator can delete this post" });
    }

    await Group.findByIdAndDelete(post.groupId);
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post and associated group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ LEAVE Post
const leavePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const group = await Group.findById(post.groupId);
    if (!group) {
      return res.status(404).json({ error: "Associated group not found" });
    }

    if (!post.members.includes(userId)) {
      return res.status(400).json({ error: "You are not a member of this post" });
    }

    if (post.createdBy.toString() === userId) {
      return deletePost(req, res); // Call deletePost if admin leaves
    }

    post.members = post.members.filter(member => member.toString() !== userId);
    await post.save();

    group.members = group.members.filter(member => member.toString() !== userId);
    await group.save();

    res.status(200).json({ message: "You have left the post and group successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ EXPORT ALL FUNCTIONS CORRECTLY
module.exports = { createPost, getPosts, joinPost, deletePost, leavePost };
