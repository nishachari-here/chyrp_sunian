import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

function SignupPage({ setUser }) {
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
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Signup failed");
      }
      const data = await res.json();
      setUser({ email, idToken: data.idToken });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Sign Up</h2>
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
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-indigo-700 underline">Login</Link>
        </div>
      </div>
    </div>
  );
}

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
      setUser({ email, idToken: data.idToken });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Login</h2>
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
          Don't have an account? <Link to="/signup" className="text-indigo-700 underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

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
    const author = user.email;
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
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
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

function BlogHome({ sidebarOpen, setSidebarOpen, user }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/posts")
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-10"
      style={{ backgroundColor: "#b4ffe7ff" }}
    >
      {/* Main container */}
      <div
        className="w-full max-w-7xl rounded-2xl shadow-lg overflow-hidden flex flex-col relative"
        style={{ backgroundColor: "rgb(245, 222, 179)" }}
      >
        {/* Topbar */}
        <div className="bg-indigo-600 text-white py-4 px-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2">My Blog</h1>
          <nav className="flex space-x-6 mb-3">
            <Link to="/" className="hover:underline">Home</Link>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Contact</a>
            {user ? (
              <span className="hover:underline">{user.email}</span>
            ) : (
              <Link to="/login" className="hover:underline">Login</Link>
            )}
            <Link to="/create" className="hover:underline font-semibold">+ Create Blog</Link>
          </nav>
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-52 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Content area with sidebar + blogs */}
        <div className="flex relative">
          {/* Sidebar */}
          {sidebarOpen && (
            <aside className="w-64 bg-indigo-100 p-5 border-r border-indigo-200 relative">
              {/* Sidebar toggle circular button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute -right-4 top-6 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow hover:bg-indigo-700 transition"
              >
                {"<<"}
              </button>
              {/* Sidebar sections */}
              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-800">Categories</h3>
                  <ul className="space-y-1 text-indigo-700">
                    <li><a href="#" className="hover:underline">Blogs</a></li>
                    <li><a href="#" className="hover:underline">Pictures</a></li>
                    <li><a href="#" className="hover:underline">Journals</a></li>
                  </ul>
                </div>
                {/* Pages */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-800">Pages</h3>
                  <ul className="space-y-1 text-indigo-700">
                    <li><a href="#" className="hover:underline">Home</a></li>
                    <li><a href="#" className="hover:underline">About</a></li>
                    <li><a href="#" className="hover:underline">Contact</a></li>
                  </ul>
                </div>
                {/* Related Posts */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-800">Related Posts</h3>
                  <ul className="space-y-1 text-indigo-700">
                    <li><a href="#" className="hover:underline">Most Popular</a></li>
                    <li><a href="#" className="hover:underline">Latest</a></li>
                    <li><a href="#" className="hover:underline">Recommended</a></li>
                  </ul>
                </div>
                {/* Archive */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-800">Archive</h3>
                  <ul className="space-y-1 text-indigo-700">
                    <li><a href="#" className="hover:underline">2025</a></li>
                    <li><a href="#" className="hover:underline">2024</a></li>
                    <li><a href="#" className="hover:underline">2023</a></li>
                  </ul>
                </div>
              </div>
            </aside>
          )}

          {/* Sidebar closed state */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-6 left-0 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow hover:bg-indigo-700 transition"
            >
              {">>"}
            </button>
          )}

          {/* Blog section */}
          <main
            className={`flex-1 p-12 grid gap-10 transition-all duration-300 ${
              sidebarOpen ? "md:grid-cols-2" : "md:grid-cols-3"
            }`}
          >
            {/* Featured blog */}
            {blogs.length > 0 && (
              <div className="col-span-full">
                <div className="mb-3">
                  <h2 className="text-2xl font-bold">{blogs[0].title}</h2>
                  <p className="text-sm text-gray-600">by {blogs[0].author}</p>
                </div>
                <div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <p className="text-gray-700">
                    {blogs[0].content}
                  </p>
                </div>
              </div>
            )}

            {/* Blog cards */}
            {blogs.slice(1).map((blog, idx) => (
              <div key={idx} className="col-span-1">
                <div className="mb-3">
                  <h2 className="text-xl font-bold">{blog.title}</h2>
                  <p className="text-sm text-gray-600">by {blog.author}</p>
                </div>
                <div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <p className="text-gray-700">
                    {blog.content}
                  </p>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage setUser={setUser} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/create" element={<CreateBlogPage user={user} />} />
        <Route
          path="*"
          element={<BlogHome sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
