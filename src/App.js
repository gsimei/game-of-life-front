import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import GameStates from "./components/GameStates";
import GameStateShow from "./components/GameStateShow";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/gamestates" /> : <LoginPage />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/gamestates" /> : <Navigate to="/login" />} />

        {/* ROTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          <Route path="/gamestates" element={<GameStates />} />
          <Route path="/gamestates/:id" element={<GameStateShow />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
