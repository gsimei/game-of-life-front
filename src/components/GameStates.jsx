import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const GameStates = () => {
  const { token, logout } = useContext(AuthContext);
  const [gameStates, setGameStates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameStates = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/game_states", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os game states");
        }

        const data = await response.json();
        setGameStates(data);

        // Redireciona para a página de criação se não houver game states
        if (data.length === 0) {
          navigate("/gamestates/new");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchGameStates();
  }, [token, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Game States</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate("/gamestates/new")}>Novo GameState</button>
      {/* Se não houver game states, redireciona automaticamente para a criação */}
      {gameStates.length === 0 ? (
        <p>Carregando game states...</p>
      ) : (
        <ul>
          {gameStates.map((gameState) => (
            <li key={gameState.id}>
              <strong>ID:</strong> {gameState.id} - <strong>Status:</strong> {gameState.status}
              <button onClick={() => navigate(`/gamestates/${gameState.id}`)}>Ver Detalhes</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameStates;
