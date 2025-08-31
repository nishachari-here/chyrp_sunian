import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1 text-indigo-800">Email or Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email or username"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-indigo-800">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function BlogHome({ sidebarOpen, setSidebarOpen }) {
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
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Contact</a>
            <Link to="/login" className="hover:underline">Login</Link>
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
            <div className="col-span-full">
              <div className="mb-3">
                <h2 className="text-2xl font-bold">Featured Blog</h2>
                <p className="text-sm text-gray-600">by John Doe</p>
              </div>
              <div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <p className="text-gray-700">
                  This is the featured blog post. It takes up the full width of the box for emphasis.
                </p>
              </div>
            </div>

            {/* Blog cards */}
            {[2, 3, 4, 5].map((id) => (
              <div key={id} className="col-span-1">
                <div className="mb-3">
                  <h2 className="text-xl font-bold">Blog Title {id}</h2>
                  <p className="text-sm text-gray-600">by Author {id}</p>
                </div>
                <div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <p className="text-gray-700">
                    Blog post summary content goes here. Self-contained inside a neat card.
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

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<BlogHome sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
      </Routes>
    </Router>
  );
}

export default App;
