import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripMaps from "./pages/TripMaps";
import DailyLogs from "./pages/DailyLogs";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AppWrapper = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Redirect from "/" to "/login" or "/dashboard" based on auth status */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trip-maps" element={<TripMaps />} />
        <Route path="/daily-logs" element={<DailyLogs />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
