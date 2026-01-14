import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { CouponProvider } from "./contexts/Coupon.tsx";

createRoot(document.getElementById("root")!).render(
   <BrowserRouter>
    <AuthProvider>
       <CouponProvider>
      <App />
       </CouponProvider>
    </AuthProvider>
  </BrowserRouter>
);