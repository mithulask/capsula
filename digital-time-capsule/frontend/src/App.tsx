import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Authentication from "./pages/Authentication";
import CreateCapsule from "./pages/CreateCapsule";
import CapsuleList from "./pages/CapsuleList";
import CapsuleView from "./pages/CapsuleView"; // ⬅️ NEW

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Authentication />} />
      <Route path="/signup" element={<Authentication />} />

      {/* Protected Routes */}
      <Route
        path="/capsules"
        element={
          <ProtectedRoute>
            <CapsuleList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-capsule"
        element={
          <ProtectedRoute>
            <CreateCapsule />
          </ProtectedRoute>
        }
      />

      {/* NEW: Capsule view page */}
      <Route
        path="/capsules/:id"
        element={
          <ProtectedRoute>
            <CapsuleView />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;
