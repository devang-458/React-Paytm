import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Signup } from "./assets/pages/Signup";
import { Signin } from "./assets/pages/Signin";
import { DashBoard } from "./assets/pages/Dashboard";
import { SendMoney } from "./assets/pages/SendMoney";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/sendmoney" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
