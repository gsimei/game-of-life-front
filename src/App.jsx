import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import GameStates from "./components/GameStates";
import GameStateShow from "./components/GameStateShow";
import NewGameStatePage from "./components/NewGameStatePage";


const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de login (Sem Navbar) */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/gamestates" /> : <LoginPage />} />
        {/* Rota de Sign Up (Deve ser acessível sem login) */}
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/gamestates" /> : <SignUpPage />} />
        {/* Redirecionamento da rota raiz */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/gamestates" /> : <Navigate to="/login" />} />

        {/* ROTAS PROTEGIDAS COM LAYOUT */}
        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutWithNavbar />}>
            <Route path="/gamestates" element={<GameStates />} />
            <Route path="/gamestates/new" element={<NewGameStatePage />} />
            <Route path="/gamestates/:id" element={<GameStateShow />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

/**
 * Envolve as páginas protegidas com a Navbar e estrutura de layout.
 */
const LayoutWithNavbar = () => {
  return (
    <Layout>
      <Outlet /> {/* Renderiza a página correspondente à rota */}
    </Layout>
  );
};

export default App;
