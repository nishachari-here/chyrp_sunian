import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

// --- Color Schemes ---
const COLORS = {
  light: {
    cyan: "#b4ffe7ff",
    brown: "rgb(245, 222, 179)",
    sidebar: "#e3e0d3", // light sidebar
    white: "#fff",
    black: "#181818",
    indigo: "#6366f1",
    orange: "#ffa726",
    shadow: "rgba(0,0,0,0.12)",
    sidebarText: "#6366f1",
  },
  dark: {
    cyan: "#0a2540", // navy blue
    brown: "#4b2e09", // woody dark brown
    sidebar: "#1a1a2e", // dark sidebar
    white: "#181818",
    black: "#f8f8f8",
    indigo: "#1e293b",
    orange: "#ffd580",
    shadow: "rgba(10, 37, 64, 0.25)",
    sidebarText: "#ffd580",
  },
};

// --- Signup Page ---
function SignupPage({ setUser, darkMode }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const colors = darkMode ? COLORS.dark : COLORS.light;

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: colors.cyan }}>
      <div className="px-6 sm:px-8 lg:px-12">
        <div className="p-8 rounded-xl shadow-md w-full max-w-md mx-auto relative" style={{ background: colors.white, color: colors.black }}>
          <button
            onClick={() => navigate("/")}
            className="absolute left-4 top-4 font-bold"
            style={{ color: colors.indigo }}
          >
            ←
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.indigo }}>
            Sign Up
          </h2>
          <form
            onSubmit={async (e) => {
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
            }}
          >
            <div className="mb-4">
              <label className="block mb-1" style={{ color: colors.indigo }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  background: colors.white,
                  color: colors.black,
                  borderColor: colors.indigo,
                }}
                placeholder="Choose a username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" style={{ color: colors.indigo }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  background: colors.white,
                  color: colors.black,
                  borderColor: colors.indigo,
                }}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1" style={{ color: colors.indigo }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  background: colors.white,
                  color: colors.black,
                  borderColor: colors.indigo,
                }}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <div className="mb-4" style={{ color: "#ff4d4f" }}>{error}</div>}
            <button
              type="submit"
              className="w-full py-2 rounded-md hover:bg-indigo-700 transition"
              style={{
                background: colors.indigo,
                color: colors.white,
              }}
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" style={{ color: colors.indigo, textDecoration: "underline" }}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Login Page ---
function LoginPage({ setUser, darkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const colors = darkMode ? COLORS.dark : COLORS.light;

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: colors.cyan }}>
      <div className="px-6 sm:px-8 lg:px-12">
        <div className="p-8 rounded-xl shadow-md w-full max-w-md mx-auto relative" style={{ background: colors.white, color: colors.black }}>
          <button
            onClick={() => navigate("/")}
            className="absolute left-4 top-4 font-bold"
            style={{ color: colors.indigo }}
          >
            ←
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.indigo }}>
            Login
          </h2>
          <form
            onSubmit={async (e) => {
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
            }}
          >
            <div className="mb-4">
              <label className="block mb-1" style={{ color: colors.indigo }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  background: colors.white,
                  color: colors.black,
                  borderColor: colors.indigo,
                }}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1" style={{ color: colors.indigo }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  background: colors.white,
                  color: colors.black,
                  borderColor: colors.indigo,
                }}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <div className="mb-4" style={{ color: "#ff4d4f" }}>{error}</div>}
            <button
              type="submit"
              className="w-full py-2 rounded-md hover:bg-indigo-700 transition"
              style={{
                background: colors.indigo,
                color: colors.white,
              }}
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: colors.indigo, textDecoration: "underline" }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Create Blog Page ---
function CreateBlogPage({ user, darkMode }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [postType, setPostType] = useState("TextWithImage");
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();
  const colors = darkMode ? COLORS.dark : COLORS.light;

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
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
    formData.append("tags", JSON.stringify(tags));

    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await axios.post("http://localhost:8000/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) throw new Error("Failed to post blog");

      setTitle("");
      setContent("");
      setFile(null);
      setTags([]);
      setMessage("Blog posted successfully!");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setMessage(err.response?.data?.detail || "An unexpected error occurred.");
    }
  };

  const fileAccepts = {
    TextWithImage: "image/*",
    Audio: "audio/*",
    Video: "video/*",
    Document: ".pdf,.doc,.docx,.txt,.ppt,.pptx",
  };

  const triggerFileInput = (type) => {
    setPostType(type);
    const input = document.getElementById("file-input");
    if (input) {
      input.setAttribute("accept", fileAccepts[type]);
      input.click();
    }
  };

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: colors.cyan }}>
      <div className="px-6 sm:px-8 lg:px-12">
        <div className="p-8 rounded-xl shadow-md w-full max-w-2xl mx-auto relative" style={{ background: colors.white, color: colors.black }}>
          <button
            onClick={() => navigate("/")}
            className="absolute left-4 top-4 font-bold"
            style={{ color: colors.indigo }}
          >
            ←
          </button>
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.indigo }}>
            Create a New Blog
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-semibold" style={{ color: colors.indigo }}>
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  background: colors.white,
                  color: colors.black,
                  borderColor: colors.indigo,
                }}
                placeholder="Enter blog title"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold" style={{ color: colors.indigo }}>
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="6"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  background: colors.white,
                  color: colors.black,
                  borderColor: colors.indigo,
                }}
                placeholder="Write your blog here..."
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold" style={{ color: colors.indigo }}>
                Tags
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  background: colors.white,
                  color: colors.black,
                  borderColor: colors.indigo,
                }}
                placeholder="Press Enter to add tag"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-1 rounded-full text-sm"
                    style={{
                      background: colors.cyan,
                      color: colors.indigo,
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-600"
                      style={{ color: colors.indigo }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className="flex space-x-3 items-center">
              <button
                type="button"
                onClick={() => triggerFileInput("TextWithImage")}
                className="py-2 px-4 rounded-md hover:bg-gray-300 transition"
                style={{
                  background: colors.brown,
                  color: colors.orange,
                }}
              >
                📷 Image
              </button>
              <button
                type="button"
                onClick={() => triggerFileInput("Video")}
                className="py-2 px-4 rounded-md hover:bg-gray-300 transition"
                style={{
                  background: colors.brown,
                  color: colors.orange,
                }}
              >
                🎬 Video
              </button>
              <button
                type="button"
                onClick={() => triggerFileInput("Audio")}
                className="py-2 px-4 rounded-md hover:bg-gray-300 transition"
                style={{
                  background: colors.brown,
                  color: colors.orange,
                }}
              >
                🎵 Audio
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="py-2 px-4 rounded-md hover:bg-gray-300 transition"
                  style={{
                    background: colors.brown,
                    color: colors.orange,
                  }}
                >
                  ➕ More
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-2 border rounded-md shadow-lg w-40 z-10"
                    style={{
                      background: colors.white,
                      borderColor: colors.indigo,
                      color: colors.indigo,
                    }}>
                    <button
                      type="button"
                      onClick={() => {
                        triggerFileInput("Document");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      style={{ color: colors.indigo }}
                    >
                      📑 Document
                    </button>
                  </div>
                )}
              </div>
            </div>
            {file && (
              <div className="mt-2 text-sm" style={{ color: colors.indigo }}>
                Selected file: <strong>{file.name}</strong>
              </div>
            )}
            <button
              type="submit"
              className="py-2 px-6 rounded-md hover:bg-indigo-700 transition"
              style={{
                background: colors.indigo,
                color: colors.white,
              }}
            >
              Publish Blog
            </button>
            {message && <div style={{ color: "#22c55e" }}>{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Profile Page ---
function ProfilePage({ user, setUser, darkMode }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const colors = darkMode ? COLORS.dark : COLORS.light;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/${user.localId}/posts`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        setPosts([]);
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

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: colors.cyan }}>
      <div className="px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto rounded-2xl shadow-lg overflow-hidden flex flex-col relative"
          style={{ backgroundColor: colors.brown, color: colors.black }}>
          <div className="flex flex-col items-center justify-center rounded-t-2xl"
            style={{ background: colors.indigo, color: colors.white }}>
            <h1 className="text-6xl font-bold py-4" style={{ color: colors.orange }}>
              Chyrp Pro
            </h1>
            <div className="flex items-center justify-between w-full px-6 py-3">
              <div className="flex items-center space-x-6">
                <Link to="/" className="hover:underline" style={{ color: colors.white }}>
                  Home
                </Link>
                <span>{user?.username}</span>
              </div>
              <Link
                to="/create"
                className="ml-4 font-semibold py-1.5 px-4 rounded-md shadow hover:bg-gray-100 transition"
                style={{
                  background: colors.white,
                  color: colors.indigo,
                }}
              >
                + Create Blog
              </Link>
            </div>
          </div>
          <div className="flex relative">
            <aside
              className="w-64 p-5 border-r relative"
              style={{
                background: colors.sidebar,
                borderColor: colors.indigo,
                color: colors.sidebarText,
              }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: colors.indigo }}>
                    Profile
                  </h3>
                  <ul className="space-y-2" style={{ color: colors.sidebarText }}>
                    <li>About You</li>
                    <li>Settings</li>
                    <li>Your Posts</li>
                    <li>Liked</li>
                    <li>Saved</li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="hover:underline"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          color: "#ff4d4f",
                        }}
                      >
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                className="absolute -right-4 top-6 w-8 h-8 rounded-full flex items-center justify-center shadow transition"
                style={{
                  background: colors.indigo,
                  color: colors.white,
                  cursor: "not-allowed",
                }}
                disabled
              >
                {"<<"}
              </button>
            </aside>
            <main className="flex-1 p-12">
              <h1 className="text-2xl font-bold mb-6">Your Posts</h1>
              {loading ? (
                <div className="text-center p-6">Loading...</div>
              ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <button
                    onClick={() => navigate("/create")}
                    className="px-6 py-3 rounded-lg shadow hover:bg-indigo-700"
                    style={{
                      background: colors.indigo,
                      color: colors.white,
                    }}
                  >
                    + Create Blog
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 border rounded-lg shadow"
                      style={{
                        background: colors.white,
                        color: colors.black,
                        borderColor: colors.indigo,
                      }}
                    >
                      <h2 className="text-xl font-semibold">{post.title}</h2>
                      <p className="mt-2" style={{ color: "#666" }}>{post.content}</p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                              style={{
                                background: colors.cyan,
                                color: colors.indigo,
                              }}
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
                            <a href={post.file_url} target="_blank" rel="noopener noreferrer" className="mt-4 block underline" style={{ color: colors.indigo }}>
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
        </div>
      </div>
    </div>
  );
}

// --- BlogPost ---
function BlogPost({ blog, handleLike, handleComment, user, featured, darkMode }) {
  const navigate = useNavigate();
  const [localCommentText, setLocalCommentText] = useState("");
  const [localShowCommentForm, setLocalShowCommentForm] = useState(false);
  const colors = darkMode ? COLORS.dark : COLORS.light;

  const onCommentSubmit = (e) => {
    e.preventDefault();
    if (localCommentText.trim() === "") return;
    handleComment(e, blog.id, localCommentText);
    setLocalCommentText("");
    setLocalShowCommentForm(false);
  };

  const handleCardClick = (e) => {
    if (
      e.target.tagName !== "BUTTON" &&
      e.target.tagName !== "TEXTAREA" &&
      e.target.tagName !== "INPUT"
    ) {
      navigate(`/post/${blog.id}`);
    }
  };

  const renderMedia = () => {
    const mediaUrl = blog.file_url || blog.image_url;
    if (!mediaUrl) return null;
    switch (blog.type) {
      case "TextWithImage":
        return <img src={mediaUrl} alt={blog.title} className={`w-full object-cover mb-4 rounded-md ${featured ? "h-64" : "h-40"}`} />;
      case "Video":
        return <video controls className={`w-full object-cover mb-4 rounded-md ${featured ? "h-64" : "h-40"}`}><source src={mediaUrl} type="video/mp4" /></video>;
      case "Audio":
        return <audio controls className={`w-full mb-4 rounded-md ${featured ? "h-24" : "h-20"}`}><source src={mediaUrl} type="audio/mpeg" /></audio>;
      case "Document":
        return <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="block underline mt-4" style={{ color: colors.indigo }}>View Document</a>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`col-span-1 flex flex-col cursor-pointer rounded-xl p-6 ${featured ? "shadow-2xl border-4 scale-105" : ""}`}
      onClick={handleCardClick}
      style={{
        background: colors.white,
        color: colors.black,
        boxShadow: featured ? `0 8px 32px ${colors.shadow}` : undefined,
        borderColor: featured ? colors.cyan : undefined,
      }}
    >
      <div className="mb-3">
        <h2 className={`font-bold ${featured ? "text-3xl" : "text-xl"}`}>{blog.title}</h2>
        <p className={`text-sm ${featured ? "text-lg" : ""}`} style={{ color: "#666" }}>by {blog.author}</p>
      </div>
      {renderMedia()}
      <p className={`line-clamp-6 flex-1 overflow-y-auto ${featured ? "text-lg" : ""}`}>{blog.content}</p>
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {blog.tags.map((tag, tagIdx) => (
            <span key={tagIdx} className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: colors.cyan, color: colors.indigo }}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center space-x-6 mt-2 px-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike(blog.id);
          }}
          className="flex items-center space-x-1"
          style={{ color: colors.indigo }}
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
          style={{ color: colors.indigo }}
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
            style={{
              background: colors.white,
              color: colors.black,
              borderColor: colors.indigo,
            }}
            placeholder="Write a comment..."
          />
          <button type="submit" className="mt-2 px-4 py-2 rounded" style={{ background: colors.indigo, color: colors.white }}>
            Post Comment
          </button>
        </form>
      )}
    </div>
  );
}

// --- BlogDetailPage ---
function BlogDetailPage({ user, darkMode }) {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const colors = darkMode ? COLORS.dark : COLORS.light;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:8000/posts/${id}`);
        const data = await res.json();
        setBlog({
          title: data.title || "",
          author: data.author || data.author_uid || "",
          content: data.content || "",
          tags: data.tags || [],
          file_url: data.file_url || data.image_url || "",
          type: data.type || "",
          likes_count: data.likes_count || 0,
        });
        setLikesCount(data.likes_count || 0);
        setComments(data.comments || []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to like posts.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/posts/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.localId })
      });
      if (res.ok) {
        const result = await res.json();
        setLikesCount(result.likes);
      }
    } catch (error) {}
  };

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
    } catch (error) {}
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
        return <a href={blog.file_url} target="_blank" rel="noopener noreferrer" className="block underline mt-4" style={{ color: colors.indigo }}>View Document</a>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: colors.cyan }}>
      <div className="px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg overflow-hidden flex flex-col relative"
          style={{ background: colors.white, color: colors.black }}>
          <div className="flex flex-col items-center justify-center rounded-t-2xl"
            style={{ background: colors.indigo, color: colors.white }}>
            <h1 className="text-4xl font-bold py-4" style={{ color: colors.orange }}>
              {blog.title}
            </h1>
            <p className="text-lg mb-2">{blog.author}</p>
          </div>
          <div className="p-8">
            {renderMedia()}
            <p className="mb-4">{blog.content}</p>
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {blog.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: colors.cyan, color: colors.indigo }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mb-6 flex items-center space-x-2 text-lg font-semibold" style={{ color: colors.orange }}>
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-yellow-200 transition"
                style={{
                  background: colors.brown,
                  color: colors.orange,
                }}
              >
                <span>👍</span>
                <span>{likesCount} Likes</span>
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Comments</h3>
              <form onSubmit={handleComment} className="mb-4">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    background: colors.white,
                    color: colors.black,
                    borderColor: colors.indigo,
                  }}
                  placeholder="Write a comment..."
                />
                <button type="submit" className="mt-2 px-4 py-2 rounded" style={{ background: colors.indigo, color: colors.white }}>
                  Post Comment
                </button>
              </form>
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p style={{ color: "#666" }}>No comments yet.</p>
                ) : (
                  comments.map((c, idx) => (
                    <div key={idx} className="p-3 rounded" style={{ background: colors.cyan, color: colors.indigo }}>
                      <span className="font-semibold">{c.username || c.user_id}</span>
                      <span className="ml-2">{c.text}</span>
                      <div className="text-xs" style={{ color: "#888" }}>{c.timestamp}</div>
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

// --- BlogHome ---
function BlogHome({ sidebarOpen, setSidebarOpen, user, darkMode, toggleDarkMode }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const colors = darkMode ? COLORS.dark : COLORS.light;

  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:8000/posts");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
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
        setBlogs(prevBlogs => prevBlogs.map(blog => {
          if (blog.id === postId) {
            return { ...blog, likes_count: newLikeCount };
          }
          return blog;
        }));
      }
    } catch (error) {}
  };

  const handleComment = async (e, postId, text) => {
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
      }
    } catch (error) {}
  };

  const isProfile = location.pathname === "/profile";
  if (loading) {
    return <div className="text-center p-6">Loading blogs...</div>;
  }
  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: colors.cyan }}>
      <div className="px-6 sm:px-8 lg:px-12">
        <div
          className="w-full max-w-7xl mx-auto rounded-2xl shadow-lg overflow-hidden flex flex-col relative"
          style={{ backgroundColor: colors.brown, color: colors.black }}
        >
          <div className="flex flex-col items-center justify-center rounded-t-2xl relative"
            style={{ background: colors.indigo, color: colors.white }}>
            <h1 className="text-6xl font-bold py-4" style={{ color: colors.orange }}>
              Chyrp Pro
            </h1>
            <div className="flex items-center justify-between w-full px-6 py-3">
              <div className="flex items-center space-x-6">
                <Link to="/" className="hover:underline" style={{ color: colors.white }}>
                  Home
                </Link>
                {user ? (
                  <Link to="/profile" className="hover:underline" style={{ color: colors.white }}>
                    {user.username}
                  </Link>
                ) : (
                  <Link to="/login" className="hover:underline" style={{ color: colors.white }}>
                    Login
                  </Link>
                )}
              </div>
              <Link
                to="/create"
                className="ml-4 font-semibold py-1.5 px-4 rounded-md shadow hover:bg-gray-100 transition"
                style={{
                  background: colors.white,
                  color: colors.indigo,
                }}
              >
                + Create Blog
              </Link>
              {/* Dark mode toggle button */}
              <button
                onClick={toggleDarkMode}
                className="absolute right-6 top-6 px-4 py-2 rounded-md shadow transition"
                style={{
                  background: darkMode ? colors.white : colors.indigo,
                  color: darkMode ? colors.indigo : colors.white,
                  border: `2px solid ${colors.indigo}`,
                  fontWeight: "bold",
                  zIndex: 20,
                }}
                aria-label="Toggle dark mode"
              >
                {darkMode ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
          </div>
          <div className="flex relative">
            {sidebarOpen && (
              <aside
                className="w-64 p-5 border-r relative"
                style={{
                  background: colors.sidebar,
                  borderColor: colors.indigo,
                  color: colors.sidebarText,
                }}
              >
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute -right-4 top-6 w-8 h-8 rounded-full flex items-center justify-center shadow transition"
                  style={{
                    background: colors.indigo,
                    color: colors.white,
                  }}
                >
                  {"<<"}
                </button>
                <div className="space-y-6">
                  {!isProfile ? (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: colors.indigo }}>
                          Categories
                        </h3>
                        <ul className="space-y-1" style={{ color: colors.sidebarText }}>
                          <li>Blogs</li>
                          <li>Images</li>
                          <li>Videos</li>
                          <li>Audio</li>
                          <li>Journal</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: colors.indigo }}>
                          For You
                        </h3>
                        <ul className="space-y-1" style={{ color: colors.sidebarText }}>
                          <li>Anime</li>
                          <li>Video Games</li>
                          <li>Silksong</li>
                          <li>Frieren</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: colors.indigo }}>
                          Tags
                        </h3>
                        <ul className="space-y-1" style={{ color: colors.sidebarText }}>
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
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.indigo }}>
                        Profile
                      </h3>
                      <ul className="space-y-1" style={{ color: colors.sidebarText }}>
                        <li>About You</li>
                        <li>Settings</li>
                        <li>Your Posts</li>
                        <li>Liked</li>
                        <li>Saved</li>
                        <li style={{ color: "#ff4d4f" }}>Log Out</li>
                      </ul>
                    </div>
                  )}
                </div>
              </aside>
            )}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="absolute top-6 left-0 w-8 h-8 rounded-full flex items-center justify-center shadow transition"
                style={{
                  background: colors.indigo,
                  color: colors.white,
                }}
              >
                {">>"}
              </button>
            )}
            <main
              className={`flex-1 p-12 grid gap-10 transition-all duration-300 ${
                sidebarOpen ? "md:grid-cols-2" : "md:grid-cols-3"
              }`}
            >
              {!isProfile && (
                blogs.length > 0 ? (
                  <>
                    <div className="md:col-span-2 bg-transparent">
                      <BlogPost
                        blog={blogs[0]}
                        handleLike={handleLike}
                        handleComment={handleComment}
                        user={user}
                        featured={true}
                        darkMode={darkMode}
                      />
                    </div>
                    {blogs.slice(1).map((blog) => (
                      <BlogPost
                        key={blog.id}
                        blog={blog}
                        handleLike={handleLike}
                        handleComment={handleComment}
                        user={user}
                        darkMode={darkMode}
                      />
                    ))}
                  </>
                ) : (
                  <p className="col-span-full text-center" style={{ color: "#666" }}>No blogs available.</p>
                )
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- App ---
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("chyrp_dark_mode");
    if (stored === "true") setDarkMode(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("chyrp_dark_mode", darkMode ? "true" : "false");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage setUser={setUser} darkMode={darkMode} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} darkMode={darkMode} />} />
        <Route path="/create" element={<CreateBlogPage user={user} darkMode={darkMode} />} />
        <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} darkMode={darkMode} />} />
        <Route path="/post/:id" element={<BlogDetailPage user={user} darkMode={darkMode} />} />
        <Route
          path="*"
          element={
            <BlogHome
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              user={user}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
