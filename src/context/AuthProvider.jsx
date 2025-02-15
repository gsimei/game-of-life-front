import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext"; // ✅ Importando corretamente

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = async () => {
    if (token) {
      try {
        const response = await fetch("https://game-of-life-api-2bbe83eb66ac.herokuapp.com/api/v1/users/sign_out", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Erro ao revogar o token no backend:", await response.json());
        }
      } catch (error) {
        console.error("Erro na requisição de logout:", error);
      }
    }
    // Remove o token localmente após a tentativa de logout (independente da resposta da API)
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
