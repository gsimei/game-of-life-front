import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import GameStates from "./components/GameStates";
import GameStateShow from "./components/GameStateShow";
import NewGameStatePage from "./components/NewGameStatePage";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/gamestates" /> : <LoginPage />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/gamestates" /> : <Navigate to="/login" />} />

        {/* ROTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          <Route path="/gamestates/new" element={<NewGameStatePage />} />
          <Route path="/gamestates" element={<GameStates />} />
          <Route path="/gamestates/:id" element={<GameStateShow />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
