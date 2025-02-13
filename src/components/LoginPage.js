import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/sign_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          user: { email, password },
        }),
      });

      if (!response.ok) {
        throw new Error("Login falhou. Verifique suas credenciais.");
      }

      const data = await response.json();
      console.log("Resposta do login:", data); // 🔥 Debug no console

      if (data.token) {
        login(data.token); // Salva o token no contexto e localStorage
        navigate("/gamestates"); // Redireciona para gamestates
      } else {
        throw new Error("Token JWT não recebido do backend!");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Página de Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
