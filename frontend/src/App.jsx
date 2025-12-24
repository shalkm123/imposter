// import { Route } from "lucide-react";
// import PlayerNames from "./pages/playernames.jsx";
// import { Routes } from "react-router-dom";

// export default function App() {
//   <Routes>
//     <Route path="/" element={<GameDashboard />} />
//     <Route path="/reveal">
//   </Routes>
//   return <PlayerNames />;
// }


import { Routes, Route, Navigate } from "react-router-dom";
import PlayerNames from "./pages/PlayerNames.jsx";
import RevealImposter from "./pages/RevealImposter.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/names" element={<PlayerNames/> } />
      <Route path="/reveal" element={<RevealImposter />} />
    </Routes>
  );
}