const Account = require("../models/account");

const BlogPost = require('../models/blogPost'); 

// Function to generate a unique slug
async function generateUniqueSlug(title, counter = 0) {
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  // Check if a blog post with this slug already exists
  const existingPost = await BlogPost.findOne({ slug });

  // If a post with the same slug exists, generate a new one with a counter
  if (existingPost) {
    // Append a counter to the slug and recursively check again
    return await generateUniqueSlug(`${slug}-${counter + 1}`, counter + 1);
  }

  // If the slug is unique, return it
  return slug;
}


const createBlogPost = async (req, res) => {
  try {
    // Extract the data from the request body
    const { title, content, topics, excerpt } = req.body;

    // Get the author information from the session (assuming it's already authenticated)
    const author = req.session.user._id;

    const isExcess = await BlogPost.count({account});
    if(isExcess > 3){
        return res.status(400).json({message: "You can only post 3 blogs"});
    }
    const slug = await generateUniqueSlug(title);
    // Create a new blog post document
    const newBlogPost = new BlogPost({
      title,
      author, 
      content,
      topics,
      excerpt,
      slug
    });

    // Save the new blog post to the database
    await newBlogPost.save();

    // Respond with a success message or redirect to the newly created post
    res.status(201).json({ message: 'Blog post created successfully', postId: newBlogPost._id });
  } catch (error) {
    // Handle errors and respond with an error message
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createBlogPost
};
