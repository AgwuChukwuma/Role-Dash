import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

// User roles
type UserRole = "Admin" | "Editor" | "Viewer";

// Authentication state
interface User {
  username: string;
  role: UserRole;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  // Login function
  const login = (username: string, role: UserRole) => {
    setUser({ username, role });
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="p-4">
        {/* Navbar (Only if logged in) */}
        {user && (
          <nav className="mb-4">
            <span className="mr-4">{user.username} ({user.role})</span>
            <Link className="mr-2" to="/dashboard">Dashboard</Link>
            <Link className="mr-2" to="/profile">Profile</Link>
            {user.role === "Admin" && <Link className="mr-2" to="/settings">Settings</Link>}
            <button onClick={logout}>Logout</button>
          </nav>
        )}

        <Routes>
          {/* Login Page */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <Dashboard role={user.role} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user?.role === "Admin" ? <Settings /> : <Navigate to="/dashboard" />} />

          {/* Default Route */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Login Component
function Login({ onLogin }: { onLogin: (username: string, role: UserRole) => void }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserRole>("Viewer");

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
        <option value="Viewer">Viewer</option>
        <option value="Editor">Editor</option>
        <option value="Admin">Admin</option>
      </select>
      <button onClick={() => onLogin(username, role)}>Login</button>
    </div>
  );
}

// Dashboard Component
function Dashboard({ role }: { role: UserRole }) {
  return (
    <div>
      <h2>Dashboard</h2>
      {role === "Admin" && <p>Admin Controls</p>}
      {role === "Editor" && <p>Editor Panel</p>}
      {role === "Viewer" && <p>Read-Only Reports</p>}
    </div>
  );
}

// Profile Component
function Profile({ user }: { user: User }) {
  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

// Settings Component (Only for Admins)
function Settings() {
  return <h2>Settings (Admin Only)</h2>;
}

export default App;
