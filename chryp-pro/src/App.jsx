import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

// Add this helper function at the top of the file, after all the imports
// For links in blogs
const linkify = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline hover:text-indigo-800 transition">
          {part}
        </a>
      );
    }
    return part;
  });
};

/* ---------------- Signup Page ---------------- */
function SignupPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Signup failed");
      }
      const data = await res.json();
      setUser({ username, email, idToken: data.idToken, localId: data.localId });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-10">
      <div className="px-6 sm:px-8 lg:px-12">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto relative">
          <button
            onClick={() => navigate("/")}
            className="absolute left-4 top-4 text-indigo-600 font-bold"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 text-indigo-800">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Choose a username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-indigo-800">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 text-indigo-800">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-700 underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Login Page ---------------- */
function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await res.json();
      setUser({ username: data.username, email, idToken: data.idToken, localId: data.localId });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-10">
      <div className="px-6 sm:px-8 lg:px-12">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto relative">
          <button
            onClick={() => navigate("/")}
            className="absolute left-4 top-4 text-indigo-600 font-bold"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 text-indigo-800">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 text-indigo-800">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-700 underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Create Blog Page ---------------- */
function CreateBlogPage({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);  // ✅ Change to a list of files
  const [postType, setPostType] = useState("TextWithImage"); // default
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false); // for + menu
  const [tags, setTags] = useState([]); // store tags
  const [tagInput, setTagInput] = useState(""); // current typing value
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files)); // ✅ Convert FileList to an array
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("You must be logged in to post.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author_uid", user.localId);
    formData.append("post_type", postType);
    formData.append("tags", JSON.stringify(tags)); // save tags array as JSON

    // ✅ Loop through the files and append each one
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await axios.post("http://localhost:8000/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) throw new Error("Failed to post blog");

      setTitle("");
      setContent("");
      setFiles([]); // ✅ Reset the files state
      setTags([]);
      setMessage("Blog posted successfully!");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      console.error("Error creating post:", err);
      setMessage(err.response?.data?.detail || "An unexpected error occurred.");
    }
  };

  // dynamic file type filters
  const fileAccepts = {
    TextWithImage: "image/*",
    Audio: "audio/*",
    Video: "video/*",
    Document: ".pdf,.doc,.docx,.txt,.ppt,.pptx",
  };

  // helper: trigger hidden file input
  const triggerFileInput = (type) => {
    setPostType(type);
    const input = document.getElementById("file-input");
    if (input) {
      input.setAttribute("accept", fileAccepts[type]);
      input.click();
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-10">
      <div className="px-6 sm:px-8 lg:px-12">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl mx-auto relative">
          <button
            onClick={() => navigate("/")}
            className="absolute left-4 top-4 text-indigo-600 font-bold"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">
            Create a New Blog
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-1 text-indigo-800 font-semibold">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter blog title"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block mb-1 text-indigo-800 font-semibold">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="6"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Write your blog here..."
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-1 text-indigo-800 font-semibold">
                Tags
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Press Enter to add tag"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-indigo-600 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {/* Toolbar with buttons */}
            <div className="flex space-x-3 items-center">
              <button
                type="button"
                onClick={() => triggerFileInput("TextWithImage")}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
              >
                📷 Image
              </button>
              <button
                type="button"
                onClick={() => triggerFileInput("Video")}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
              >
                🎬 Video
              </button>
              <button
                type="button"
                onClick={() => triggerFileInput("Audio")}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
              >
                🎵 Audio
              </button>

              {/* Dropdown for others */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                >
                  ➕ More
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-2 bg-white border rounded-md shadow-lg w-40 z-10">
                    <button
                      type="button"
                      onClick={() => {
                        triggerFileInput("Document");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📑 Document
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Selected file */}
            {file && (
              <div className="mt-2 text-sm text-gray-600">
                Selected file: <strong>{file.name}</strong>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition"
            >
              Publish Blog
            </button>
            {message && <div className="text-green-700">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Profile Page ---------------- */
function ProfilePage({ user, setUser }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // redirect if not logged in
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/users/${user.localId}/posts`);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-100 p-4 space-y-4 border-r">
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        <ul className="space-y-3">
          <li><button className="w-full text-left font-semibold">My Posts</button></li>
          <li><button className="w-full text-left text-gray-500">My Media</button></li>
          <li><button className="w-full text-left text-gray-500">Bookmarked</button></li>
          <li><button className="w-full text-left text-gray-500">Liked</button></li>
          <li>
            <button onClick={handleLogout} className="w-full text-left text-red-600">Log Out</button>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">My Posts</h1>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <button
              onClick={() => navigate("/create")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              + Create Blog
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div key={post.id} className="p-4 border rounded-lg shadow bg-white">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600 mt-2">{linkify(post.content)}</p>
                {/* This section should be added to render the tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="bg-indigo-200 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {post.file_url && (
                    <>
                        {post.type === "TextWithImage" && (
                            <img src={post.file_url} alt="Post" className="mt-4 rounded-lg" />
                        )}
                        {post.type === "Video" && (
                            <video controls className="mt-4 rounded-lg">
                                <source src={post.file_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        {post.type === "Audio" && (
                            <audio controls className="mt-4 rounded-lg">
                                <source src={post.file_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                        {post.type === "Document" && (
                            <a href={post.file_url} target="_blank" rel="noopener noreferrer" className="mt-4 block text-indigo-600 underline">
                                View Document
                            </a>
                        )}
                    </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BlogPost({ blog, handleLike, handleComment, user }) {
  const navigate = useNavigate();
  const [localCommentText, setLocalCommentText] = useState("");
  const [localShowCommentForm, setLocalShowCommentForm] = useState(false);

  const onCommentSubmit = (e) => {
    e.preventDefault();
    if (localCommentText.trim() === "") return;
    handleComment(e, blog.id, localCommentText);
    setLocalCommentText("");
    setLocalShowCommentForm(false);
  };

  const handleCardClick = (e) => {
    // Only navigate if the click is NOT on a button or textarea
    if (
      e.target.tagName !== "BUTTON" &&
      e.target.tagName !== "TEXTAREA" &&
      e.target.tagName !== "INPUT"
    ) {
      navigate(`/post/${blog.id}`);
    }
  };

const renderMedia = () => {
    if (!blog.file_urls || blog.file_urls.length === 0) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        {blog.file_urls.map((url, urlIndex) => (
          <div key={urlIndex}>
            {blog.type === "TextWithImage" && (
                <img
                  src={url}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-md"
                />
            )}
            {blog.type === "Video" && (
                <video controls className="w-full h-40 object-cover rounded-md">
                  <source src={url} type="video/mp4" />
                </video>
            )}
            {blog.type === "Audio" && (
                <audio controls className="w-full h-16 rounded-md">
                  <source src={url} type="audio/mpeg" />
                </audio>
            )}
            {blog.type === "Document" && (
                <a href={url} target="_blank" rel="noopener noreferrer" className="block text-indigo-600 underline">
                  View Document {urlIndex + 1}
                </a>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
        <div className="col-span-1 flex flex-col cursor-pointer" onClick={handleCardClick}>
      <div className="mb-3">
        <h2 className="text-xl font-bold">{blog.title}</h2>
        <p className="text-sm text-gray-600">by {blog.author}</p>
      </div>
      <div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition min-h-[16rem] overflow-hidden flex flex-col">
        {renderMedia()}
        <p className="text-gray-700 line-clamp-6 flex-1 overflow-y-auto">{linkify(blog.content)}</p>
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {blog.tags.map((tag, tagIdx) => (
              <span key={tagIdx} className="bg-indigo-200 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </div>
      {/* Likes & Comments section */}
      <div className="flex items-center space-x-6 mt-2 text-gray-700 px-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike(blog.id);
          }}
          className="flex items-center space-x-1"
        >
          <span>👍</span>
          <span>{blog.likes_count || 0}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLocalShowCommentForm(!localShowCommentForm);
          }}
          className="flex items-center space-x-1"
        >
          <span>💬</span>
          <span>{blog.comments ? blog.comments.length : 0}</span>
        </button>
      </div>
      {localShowCommentForm && (
        <form
          onClick={e => e.stopPropagation()}
          onSubmit={onCommentSubmit}
          className="mt-4"
        >
          <textarea
            value={localCommentText}
            onChange={(e) => setLocalCommentText(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Write a comment..."
          />
          <button type="submit" className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded">
            Post Comment
          </button>
        </form>
      )}
    </div>
  );
}

/* ---------------- Blog Detail Page ---------------- */
function BlogDetailPage({ user }) {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:8000/posts/${id}`);
        const data = await res.json();

        // Map backend fields to frontend expected fields
        setBlog({
          title: data.title || "",
          author: data.author || data.author_uid || "",
          content: data.content || "",
          tags: data.tags || [],
          file_url: data.file_url || data.image_url || "",
          type: data.type || "",
          likes_count: data.likes_count || 0,
        });
        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) {
      alert("You must be logged in and write a comment.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/posts/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.localId, text: commentText })
      });
      if (res.ok) {
        const newComment = { user_id: user.localId, text: commentText, timestamp: new Date().toISOString() };
        setComments([...comments, newComment]);
        setCommentText("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  if (loading) return <div className="text-center p-6">Loading post...</div>;
  if (!blog) return <div className="text-center p-6">Post not found.</div>;

  const renderMedia = () => {
    if (!blog.file_url) return null;
    switch (blog.type) {
      case "TextWithImage":
        return <img src={blog.file_url} alt={blog.title} className="w-full h-40 object-cover mb-4 rounded-md" />;
      case "Video":
        return <video controls className="w-full h-40 object-cover mb-4 rounded-md"><source src={blog.file_url} type="video/mp4" /></video>;
      case "Audio":
        return <audio controls className="w-full h-20 mb-4 rounded-md"><source src={blog.file_url} type="audio/mpeg" /></audio>;
      case "Document":
        return <a href={blog.file_url} target="_blank" rel="noopener noreferrer" className="block text-indigo-600 underline mt-4">View Document</a>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: "#b4ffe7ff" }}>
      <div className="px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg overflow-hidden flex flex-col relative bg-white">
          <div className="bg-indigo-600 text-white flex flex-col items-center justify-center rounded-t-2xl">
            <h1 className="text-4xl font-bold text-orange-400 py-4">{blog.title}</h1>
            <p className="text-white text-lg mb-2">by {blog.author}</p>
          </div>
          <div className="p-8">
            {renderMedia()}
            <p className="text-gray-700 mb-4">{blog.content}</p>
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {blog.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="bg-indigo-200 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            )}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Comments</h3>
              <form onSubmit={handleComment} className="mb-4">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Write a comment..."
                />
                <button type="submit" className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded">
                  Post Comment
                </button>
              </form>
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500">No comments yet.</p>
                ) : (
                  comments.map((c, idx) => (
                    <div key={idx} className="bg-gray-100 p-3 rounded">
                      <span className="font-semibold">{c.username || c.user_id}</span>
                      <span className="ml-2 text-gray-600">{c.text}</span>
                      <div className="text-xs text-gray-400">{c.timestamp}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Blog Home ---------------- */
function BlogHome({ sidebarOpen, setSidebarOpen, user }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:8000/posts");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

const handleLike = async (postId) => {
    if (!user) {
        alert("You must be logged in to like posts.");
        return;
    }
    try {
        const res = await fetch(`http://localhost:8000/posts/${postId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.localId })
        });
        
        if (res.ok) {
            const result = await res.json();
            const newLikeCount = result.likes;
            
            // This is the crucial part that ensures the live update
            setBlogs(prevBlogs => prevBlogs.map(blog => {
                if (blog.id === postId) {
                    return { ...blog, likes_count: newLikeCount };
                }
                return blog;
            }));
        } else {
            console.error("Failed to like post on server.");
        }
    } catch (error) {
        console.error("Failed to like post:", error);
    }
};

const handleComment = async (e, postId, text) => {
    // Note: I modified the handleComment function to receive 'text' as a parameter
    e.preventDefault();
    if (!user || !text) {
      alert("You must be logged in and write a comment.");
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.localId, text: text })
      });
      
      if (res.ok) {
        const newComment = { user_id: user.localId, text: text, timestamp: new Date().toISOString() };
        setBlogs(prevBlogs => prevBlogs.map(blog => {
          if (blog.id === postId) {
            const updatedComments = blog.comments ? [...blog.comments, newComment] : [newComment];
            return { ...blog, comments: updatedComments };
          }
          return blog;
        }));
      } else {
        console.error("Failed to post comment on server.");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };
  const isProfile = location.pathname === "/profile";
if (loading) {
    return <div className="text-center p-6">Loading blogs...</div>;
  }
  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: "#b4ffe7ff" }}>
      {/* outer padding creates a guaranteed gap from the window edge */}
      <div className="px-6 sm:px-8 lg:px-12">
        {/* inner app card */}
        <div
          className="w-full max-w-7xl mx-auto rounded-2xl shadow-lg overflow-hidden flex flex-col relative"
          style={{ backgroundColor: "rgb(245, 222, 179)" }}
        >
          {/* Topbar */}
          <div className="bg-indigo-600 text-white flex flex-col items-center justify-center rounded-t-2xl">
            <h1 className="text-6xl font-bold text-orange-400 py-4">Chyrp Pro</h1>
            <div className="flex items-center justify-between w-full px-6 py-3">
              <div className="flex items-center space-x-6">
                <Link to="/" className="hover:underline">Home</Link>
                {user ? (
                  <Link to="/profile" className="hover:underline">{user.username}</Link>
                ) : (
                  <Link to="/login" className="hover:underline">Login</Link>
                )}
              </div>
              <Link
                to="/create"
                className="ml-4 bg-white text-indigo-700 font-semibold py-1.5 px-4 rounded-md shadow hover:bg-gray-100 transition"
              >
                + Create Blog
              </Link>
            </div>
          </div>

          {/* Content area */}
          <div className="flex relative">
            {sidebarOpen && (
              <aside className="w-64 bg-indigo-100 p-5 border-r border-indigo-200 relative">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute -right-4 top-6 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow hover:bg-indigo-700 transition"
                >
                  {"<<"}
                </button>
                <div className="space-y-6">
                  {!isProfile ? (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-indigo-800">Categories</h3>
                        <ul className="space-y-1 text-indigo-700">
                          <li>Blogs</li>
                          <li>Images</li>
                          <li>Videos</li>
                          <li>Audio</li>
                          <li>Journal</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-indigo-800">For You</h3>
                        <ul className="space-y-1 text-indigo-700">
                          <li>Anime</li>
                          <li>Video Games</li>
                          <li>Silksong</li>
                          <li>Frieren</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-indigo-800">Tags</h3>
                        <ul className="space-y-1 text-indigo-700">
                          <li>Movies</li>
                          <li>Anime</li>
                          <li>Cooking</li>
                          <li>Music</li>
                          <li>Video Games</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-indigo-800">Profile</h3>
                      <ul className="space-y-1 text-indigo-700">
                        <li>About You</li>
                        <li>Settings</li>
                        <li>Your Posts</li>
                        <li>Liked</li>
                        <li>Saved</li>
                        <li className="text-red-500">Log Out</li>
                      </ul>
                    </div>
                  )}
                </div>
              </aside>
            )}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="absolute top-6 left-0 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow hover:bg-indigo-700 transition"
              >
                {">>"}
              </button>
            )}

            {/* Blog list */}
            <main
        className={`flex-1 p-12 grid gap-10 transition-all duration-300 ${
          sidebarOpen ? "md:grid-cols-2" : "md:grid-cols-3"
        }`}
      >
        {!isProfile && (
          blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogPost 
                key={blog.id} 
                blog={blog} 
                handleLike={handleLike} 
                handleComment={handleComment} 
                user={user} 
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-700">No blogs available.</p>
          )
        )}
      </main>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- App ---------------- */
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage setUser={setUser} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/create" element={<CreateBlogPage user={user} />} />
        <Route path="/profile" element={<BlogHome sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />} />
        <Route path="/post/:id" element={<BlogDetailPage user={user} />} />
        <Route
          path="*"
          element={
            <BlogHome
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              user={user}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
