// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "@/lib/api";
// import Admin from "@/pages/Admin";
// import AuthPage from "@/pages/Auth";

// const AdminGuard = () => {
//   const navigate = useNavigate();
//   const [status, setStatus] = useState<"loading" | "auth" | "admin">("loading");

//   useEffect(() => {
//     api.get("/admin")
//       .then(() => {
//         setStatus("admin");
//       })
//       .catch((err) => {
//         if (err.response?.status === 401) {
//           setStatus("auth");
//         } else if (err.response?.status === 403) {
//           navigate("/", { replace: true });
//         } else {
//           navigate("/", { replace: true });
//         }
//       });
//   }, [navigate]);

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Đang kiểm tra quyền truy cập...
//       </div>
//     );
//   }

//   if (status === "auth") return <AuthPage />;

//   return <Admin />;
// };

// export default AdminGuard;
