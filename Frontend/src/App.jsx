import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { Signup } from "../src/assets/pages/Signup";
import { Signin } from "../src/assets/pages/Signin";
import { Dashboard } from "../src/assets/pages/Dashboard";
import { SendMoney } from "../src/assets/pages/SendMoney";
import { Transactions } from "../src/assets/pages/Transactions";
import { Profile } from "../src/assets/pages/Profile";
import { ProtectedRoute } from "../src/assets/Components/ProtectedRoute";
import useAuthStore from "../src/hooks/useAuth";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/signin" replace />
            } 
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/send-money" 
            element={
              <ProtectedRoute>
                <SendMoney />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;