import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Callback from "./pages/Callback";

// Самые простые маршруты
export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />

    {/* Здесь мы окажемся после redirect от Authoriza */}
    <Route path="/callback" element={<Callback />} />
  </Routes>
);
