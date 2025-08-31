import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 relative">
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 relative">
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
  );
}

/* ---------------- Create Blog Page ---------------- */
function CreateBlogPage({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!user) {
      setMessage("You must be logged in to post.");
      return;
    }
    const author = user.username || user.email;
    try {
      const res = await fetch("http://localhost:8000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, author }),
      });
      if (!res.ok) throw new Error("Failed to post blog");
      setTitle("");
      setContent("");
      setMessage("Blog posted!");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl relative">
        <button
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 text-indigo-600 font-bold"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Create a New Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-indigo-800 font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter blog title"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-indigo-800 font-semibold">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Write your blog here..."
              required
            />
          </div>
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
  );
}

/* ---------------- Profile Page ---------------- */
function ProfilePage({ user }) {
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-indigo-50">
        <div className="bg-white p-6 rounded-xl shadow">Please login.</div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">About {user.username}</h2>
        <p className="mb-1"><strong>Username:</strong> {user.username}</p>
        <p className="mb-1"><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

/* ---------------- Blog Home ---------------- */
function BlogHome({ sidebarOpen, setSidebarOpen, user }) {
  const [blogs, setBlogs] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:8000/posts")
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error(err));
  }, []);

  const isProfile = location.pathname === "/profile";

  return (
    <div className="min-h-screen flex items-center justify-center py-10" style={{ backgroundColor: "#b4ffe7ff" }}>
      <div className="w-full max-w-7xl rounded-2xl shadow-lg overflow-hidden flex flex-col relative" style={{ backgroundColor: "rgb(245, 222, 179)" }}>
        
        {/* Topbar with Chyrp Pro */}
        <div className="bg-indigo-600 text-white flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-orange-400 py-2">Chyrp Pro</h1>
          <div className="flex items-center justify-between w-full px-6 py-3 border-t border-indigo-500">
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

        {/* Content area with sidebar */}
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
            {!isProfile ? (
              blogs.length > 0 ? (
                <>
                  <div className="col-span-full">
                    <div className="mb-3">
                      <h2 className="text-2xl font-bold">{blogs[0].title}</h2>
                      <p className="text-sm text-gray-600">by {blogs[0].author}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                      <p className="text-gray-700">{blogs[0].content}</p>
                    </div>
                  </div>
                  {blogs.slice(1).map((blog, idx) => (
                    <div key={idx} className="col-span-1">
                      <div className="mb-3">
                        <h2 className="text-xl font-bold">{blog.title}</h2>
                        <p className="text-sm text-gray-600">by {blog.author}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <p className="text-gray-700">{blog.content}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-gray-700">No blogs available.</p>
              )
            ) : (
              <div className="bg-gray-50 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Your Profile Feed</h2>
                <p className="text-gray-700">Use the sidebar to explore your posts, settings, or saved content.</p>
              </div>
            )}
          </main>
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
