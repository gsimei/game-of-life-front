import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Atualiza o localStorage quando o token mudar
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, [token]);

  // Função de login para salvar o token
  const login = (newToken) => {
    console.log("Salvando token no localStorage:", newToken); // 🔥 Debug
    setToken(newToken);
  };

  // Função de logout para remover o token
  const logout = () => {
    console.log("Removendo token do localStorage"); // 🔥 Debug
    setToken(null);
  };

  // Função genérica para fazer requisições autenticadas
  const apiFetch = async (url, options = {}) => {
    if (!token) {
      console.error("Tentativa de requisição sem token!");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // 🔥 Enviando token JWT corretamente
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        console.error("Erro 401: Token inválido ou expirado!");
        logout(); // Remove o token se for inválido
      }

      return response;
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
