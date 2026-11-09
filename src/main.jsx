import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ToastContainer />
    </AuthProvider>
  </StrictMode>,
);
